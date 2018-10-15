const searchMembers = require("../../util/searchMembers");
const allMmrEmbed = require("../../embeds/allMmr");
const singleMmrEmbed = require("../../embeds/singleMmr");
const SteppedList = require("../../classes/SteppedList");
const prettyMs = require("pretty-ms");

async function all(ctx) {
    let msg = false;
    try {
        let res = await ctx.client.pg.query("SELECT * FROM public.users;");
        let rows = res.rows.filter((row) => ctx.guild.members.get(row.id));

        msg = await ctx.send(ctx.strings.get("mmr_in_progress", prettyMs(rows.length * 500, { verbose: true })));

        let queries = rows.map((row) => upsertMmr(ctx.client.pg, ctx.client.mika, row, false));
        let results = await Promise.all(queries);

        results = results.sort((a, b) => (b.scr || 0) - (a.scr || 0));

        let list = [
            results.map((r) => ctx.guild.members.get(r.id).username.slice(0, 16)),
            results.map((r) => r.scr || ctx.strings.get("matches_match_unknown_player")),
            results.map((r) => r.cr || ctx.strings.get("matches_match_unknown_player"))
        ];

        let embed = allMmrEmbed.call(ctx.strings, results, ctx.guild.members, ctx.guild.name);
        let watcher = new SteppedList(ctx, msg, 15, embed, [ctx.strings.get("mmr_all_players"), "Solo", "Party"], list);
        let newEmbed = watcher.embed(0);
        newEmbed.content = "";

        await msg.edit(newEmbed);

        ctx.client.watchers[msg.id] = watcher;
        return Promise.resolve();
    } catch (err) {
        ctx.error(err);
        if (msg) return msg.edit(":x: " + ctx.strings.get("bot_generic_error"));
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

async function exec(ctx) {
    if (ctx.options[0] === "all") return ctx.send("all disabled for now sorry"); // return all(ctx);

    try {
        let ID = ctx.author.id;
        if (ctx.options.length) {
            let members = await searchMembers(ctx.guild.members, ctx.options);
            if (!members.found) return ctx.failure(ctx.strings.get("bot_no_member"));
            ID = members.all[0];
        }

        let member = ctx.guild.members.get(ID);
        let res = await ctx.client.pg.query({
            "text": "SELECT * FROM public.users WHERE id = $1;",
            "values": [ID]
        });
        
        if (!res.rows.length) {
            return ctx.failure(ctx.strings.get("bot_not_registered", member.username, ctx.gcfg.prefix));
        }

        let profile = await ctx.client.mika.getPlayer(res.rows[0].dotaid);
        let winlose = await ctx.client.mika.getPlayerWL(res.rows[0].dotaid);

        let msg = await singleMmrEmbed.call(ctx.strings, { profile, winlose, member, tier: profile.rank_tier || 0, rank: profile.leaderboard_rank || false });
        return ctx.send({ embed: msg.embed }, msg.file);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "badge",
    category: "personal",
    aliases: ["mmr", "rank", "medal"],
    typing: true,
    exec
};

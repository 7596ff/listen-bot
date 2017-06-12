const upsertMmr = require("../../util/upsertMmr");
const searchMembers = require("../../util/searchMembers");
const allMmrEmbed = require("../../embeds/allMmr");
const singleMmrEmbed = require("../../embeds/singleMmr");
const prettyMs = require("pretty-ms");

async function all(ctx) {
    let msg = false;
    try {
        let res = await ctx.client.pg.query("SELECT * FROM public.users;");
        let rows = res.rows.filter((row) => ctx.guild.members.get(row.id));

        msg = await ctx.send(ctx.strings.get("mmr_in_progress", prettyMs(rows.length * 1000, { verbose: true })));

        let queries = rows.map((row) => upsertMmr(ctx.client.pg, ctx.client.mika, row, false));
        let results = await Promise.all(queries);

        results = results
            .sort((a, b) => (b.scr || 0) - (a.scr || 0))
            .slice(0, 15);

        let embed = allMmrEmbed.call(ctx.strings, results, ctx.guild.members, ctx.guild.name);
        return msg.edit({
            content: "",
            embed
        });
    } catch (err) {
        console.error(err);
        if (msg) return msg.edit(":x: " + ctx.strings.get("bot_generic_error"));
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

async function exec(ctx) {
    if (ctx.options[0] === "all") return all(ctx);

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

        let upserted = await upsertMmr(ctx.client.pg, ctx.client.mika, res.rows[0], true);
        upserted.member = member;

        let embed = singleMmrEmbed.call(ctx.strings, upserted);
        return ctx.embed(embed);
    } catch (err) {
        console.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "mmr",
    category: "personal",
    typing: true,
    exec
};

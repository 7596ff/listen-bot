const searchMembers = require("../../util/searchMembers");
const allMmrEmbed = require("../../embeds/allMmr");
const singleMmrEmbed = require("../../embeds/singleMmr");
const SteppedList = require("../../classes/SteppedList");
const prettyMs = require("pretty-ms");

async function exec(ctx) {
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

const searchMembers = require("../../util/searchMembers");
const checkDiscordID = require("../../util/checkDiscordID");

async function exec(ctx) {
    try {
        let members;
        if (ctx.options.length) {
            members = await searchMembers(ctx.guild.members, ctx.options);
            if (!members.found) return ctx.failure(ctx.strings.get("bot_no_member"));
        } else {
            members = false;
        }

        let ID = members ? members.all[0] : ctx.author.id;
        let member = await checkDiscordID(ctx.client.pg, ID);

        if (!member) {
            return ctx.failure(ctx.strings.get("bot_not_registered", ctx.guild.members.get(ID).username, ctx.gcfg.prefix));
        }

        await ctx.client.redis.setAsync(`listen:nextmatch:${member}`, ctx.channel.id);
        ctx.client.redis.publish("listen:matches:new", JSON.stringify({
            action: "refresh"
        }));

        return ctx.send(`Watching for ${ctx.client.users.get(ID).username}'s next match, and posting it to this channel.`);
    } catch (err) {
        console.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "nextmatch",
    aliases: ["nm", "nextgame"],
    category: "personal",
    typing: true,
    exec
};

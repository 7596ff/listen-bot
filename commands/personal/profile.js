const searchMembers = require("../../util/searchMembers");
const checkDiscordID = require("../../util/checkDiscordID");
const playerinfoEmbed = require("../../embeds/playerinfo");

async function getProfile(ctx, id) {
    try {
        let promises = [
            ctx.client.mika.getPlayer(id),
            ctx.client.mika.getPlayerWL(id),
            ctx.client.mika.getPlayerHeroes(id)
        ];

        let results = await Promise.all(promises);

        let player = results[0];
        player.wl = results[1];
        player.heroes = results[2];

        return player;
    } catch (err) {
        throw err;
    }
}

async function cacheProfile(ctx, id) {
    try {
        let key = `playerinfo:${id}`;
        let reply = await ctx.client.redis.getAsync(key);

        if (reply) return JSON.parse(reply);

        reply = await getProfile(ctx, id);
        await ctx.client.redis.setexAsync(key, 3600, JSON.stringify(reply));

        return reply;
    } catch (err) {
        throw err;
    }
}

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

        let profile = await cacheProfile(ctx, member);

        let embed = await playerinfoEmbed(profile);
        return ctx.send({ embed: embed.embed }, embed.file);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "profile",
    category: "personal",
    aliases: ["playerinfo"],
    typing: true,
    exec
};

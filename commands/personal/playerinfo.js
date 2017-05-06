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
            if (!members.found) return ctx.send("Couldn't find any members!");
        } else {
            members = false;
        }

        let id = await checkDiscordID(ctx.client.pg, members ? members.all[0] : ctx.author.id);
        if (!id) return ctx.send(`${ctx.guild.members.get(members.all[0]).username} has not registered with me yet! Try \`${ctx.gcfg.prefix}help register\`.`);

        let profile = await cacheProfile(ctx, id);

        let embed = playerinfoEmbed(profile);
        return ctx.embed(embed);
    } catch (err) {
        console.error(err);
        return ctx.send("Something went wrong.");
    }
}

module.exports = {
    name: "playerinfo",
    category: "personal",
    aliases: ["profile"],
    typing: true,
    exec
};

const fs = require("fs");

async function checks(client, member) {
    return member.id == client.config.owner;
}

async function exec(ctx) {
    const ID = ctx.options[0];
    if (ID) {
        let guild = ctx.client.guilds.get(ID);
        if (guild) {
            ctx.client.redis.set(`${ctx.client.user.id}:blacklist:${guild.id}`, true);
            guild.leave();
            return ctx.send(`nuked ${guild.id}/${guild.name}`);
        } else {
            return ctx.send("Can't find guild.");
        }
    } else {
        return ctx.send("No guild.");
    }
}

module.exports = {
    name: "blacklist",
    category: "owner",
    ignoreCooldowns: true,
    checks,
    exec
};

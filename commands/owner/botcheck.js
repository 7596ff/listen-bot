async function checks(client, member) {
    return member.id == client.config.owner;
}

async function exec(ctx) {
    const ID = ctx.options[0];
    if (ID) {
        let guild = ctx.client.guilds.get(ID);
        if (guild) {
            ctx.send(`${guild.members.filter(member => member.bot).length} bots / ${guild.members.size} members`);
        } else {
            ctx.send("Can't find guild.");
        }
    } else {
        ctx.send("No guild.");
    }
}

module.exports = {
    name: "botcheck",
    category: "owner",
    ignoreCooldowns: true,
    checks,
    exec
};

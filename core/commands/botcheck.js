function botcheck(message, client, helper) {
    const ID = message.content.split(" ")[1];
    if (ID) {
        let guild = client.guilds.get(ID);
        if (guild) {
            message.channel.createMessage(`${guild.members.filter(member => member.bot).length} bots / ${guild.members.size} members`).catch((err) => helper.handle(err));
        } else {
            message.channel.createMessage("Can't find guild.").catch((err) => helper.handle(err));
        }
    } else {
        message.channel.createMessage("No guild.").catch((err) => helper.handle(err));
    }
}

module.exports = botcheck;

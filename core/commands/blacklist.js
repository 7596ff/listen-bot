const fs = require("fs");

function blacklist(message, client, helper) {
    const ID = message.content.split(" ")[1];
    if (ID) {
        let guild = client.guilds.get(ID);
        if (guild) {
            client.redis.set(`${client.user.id}:blacklist:${guild.id}`, true);
            guild.leave();
            message.channel.createMessage(`nuked ${guild.id}/${guild.name}`).catch((err) => helper.handle(message, err));
        } else {
            message.channel.createMessage("Can't find guild.").catch((err) => helper.handle(message, err));
        }
    } else {
        message.channel.createMessage("No guild.").catch((err) => helper.handle(message, err));
    }
}

module.exports = blacklist;

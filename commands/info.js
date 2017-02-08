module.exports = (message, client, helper) => {
    let me = message.channel.guild.members.has("102645408223731712") ? "<@102645408223731712>" : "alexa#2899";

    client.createMessage(message.channel.id, {"embed": {
        "fields": [
            {
                "name": "GitHub",
                "value": "https://github.com/bippum/listen-bot"
            },
            {
                "name": "Invite to your server", 
                "value": "https://discordapp.com/oauth2/authorize?permissions=19456&scope=bot&client_id=240209888771309568"
            },
            {
                "name": "Join our help server",
                "value": require("../json/config.json").discord_invite
            }
        ],
        "timestamp": new Date().toJSON(),
        "description": `A Dota 2 related bot. Features include current talents and patch notes for 6.79+ heroes. Contact ${me} for support and questions!`
    }}).then(() => {
        helper.log(message, "sent info message");
    }).catch(err => helper.handle(message, err));
};

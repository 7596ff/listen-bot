module.exports = (message, client, helper) => {
    let me = message.channel.guild.members.has("102645408223731712") ? "<@102645408223731712>" : "alexa#2899";

    let desc = [
        `A Dota 2 related bot. Features include current \ntalents and patch notes for 6.79+ heroes. \nContact ${me} for support and questions!\n`,
        ":page_facing_up: [GitHub](https://github.com/bippum/listen-bot)",
        ":link: [Invite Link](https://discordapp.com/oauth2/authorize?permissions=19456&scope=bot&client_id=240209888771309568)",
        `:information_source: [Help Server](${require("../json/config.json").discord_invite})`
    ];

    client.createMessage(message.channel.id, {"embed": {
        "timestamp": new Date().toJSON(),
        "description": desc.join("\n")
    }}).then(() => {
        helper.log(message, "sent info message");
    }).catch(err => helper.handle(message, err));
};

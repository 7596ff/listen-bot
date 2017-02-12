module.exports = (message, client, helper) => {
    let me = message.channel.guild.members.has(client.config.owner) ? `<@${client.config.owner}>` : "alexa#2899";

    let desc = [
        `A Dota 2 related bot. Features include current \ntalents and patch notes for 6.79+ heroes. \nContact ${me} for support and questions!\n`,
        ":page_facing_up: [GitHub](https://github.com/bippum/listen-bot)",
        `:link: [Invite Link](${client.config.url_invite})`,
        `:information_source: [Help Server](${client.config.discord_invite})`
    ];

    message.channel.createMessage({
        "embed": {
            "timestamp": new Date().toJSON(),
            "description": desc.join("\n")
        }
    }).then(() => {
        helper.log(message, "sent info message");
    }).catch(err => helper.handle(message, err));
};

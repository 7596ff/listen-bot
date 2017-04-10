const prettyms = require("pretty-ms");

function suggest(message, client, helper) {
    if (message.content.trim() == "suggest") {
        message.channel.createMessage(`${message.author.mention}, please give me an actual suggestion!`).catch((err) => helper.handle(message, err));
        return;
    }

    let key = `${client.user.id}:suggest:${message.author.id}`;
    client.redis.ttl(key, (err, reply) => {
        if (reply == -2) {
            client.redis.setex(key, 86400, true, (err) => {
                if (err) {
                    helper.log(message, "redis setex err in suggest");
                    helper.log(message, key);
                    helper.log(message, err);
                }
            });

            client.createMessage(client.config.suggestion_channel, { "embed": {
                "author": {
                    "icon_url": message.author.avatarURL,
                    "name": message.author.username
                }, 
                "description": message.content.split(" ").slice(1).join(" "),
                "timestamp": new Date(message.timestamp),
                "footer": {
                    "icon_url": message.channel.guild.iconURL,
                    "text": `From server ${message.channel.guild.name}`
                }
            }}).catch((err) => helper.handle(message, err)).then(() => {
                message.channel.createMessage(`${message.author.mention}, your suggestion has been recorded! Thank you for your valuable feedback.`).catch((err) => helper.handle(message, err));
                helper.log(message, `added a suggestion from ${message.channel.guild.name} by ${message.author.username}`);
            });
        } else {
            message.channel.createMessage(`${message.author.mention}, you can only create a suggestion every 24 hours! You have ${prettyms(reply * 1000)} remaining.`).catch((err) => helper.handle(message, err));
        }
    });
}

module.exports = suggest;

const help = require("../json/help.json");

module.exports = (message, client, helper) => {
    let embed = {
        "fields": [],
        "author": {
            "name": `Total: ${client.all_usage.all}`
        }
    }
    Object.keys(help).forEach(key => {
        embed.fields.push({
            "name": key,
            "value": help[key].map(topic => `\`${topic.name}\`: ${client.all_usage[topic.name] || 0}`).join("\n"), 
            "inline": true
        });
    });

    let len = embed.fields.length % 3;
    for (i = 0; i < 3 - len; i++) {
        embed.fields.push({
            "name": "\u200b",
            "value": "\u200b",
            "inline": true
        });
    }

    console.log(embed.fields.length)

    message.channel.createMessage({
        "embed": embed
    }).catch(err => helper.handle(message, err));
};

module.exports = (message, client, helper) => {
    client.createMessage(message.channel.id, {
        "embed": {
            "fields": [
                {
                    "name": "Node.js Version",
                    "value": process.version,
                    "inline": true
                },
                {
                    "name": "Eris Version",
                    "value": require("eris/package.json").version,
                    "inline": true
                },
                {
                    "name": "Memory Usage",
                    "value": `${(process.memoryUsage().rss / (1024 * 1024)).toFixed(1)} MB`,
                    "inline": true
                }, {
                    "name": "Servers / Users",
                    "value": `${client.guilds.size} / ${client.users.size}`,
                    "inline": true
                }, {
                    "name": "Uptime",
                    "value": require('pretty-ms')(client.uptime),
                    "inline": true
                }, {
                    "name": "Cmds (session/all time)",
                    "value": `${client.usage.all}/${client.all_usage.all}`,
                    "inline": true
                }
            ],
            "timestamp": new Date().toJSON()
        }
    }).then(new_message => {
        helper.log(message, "sent stats")
    }).catch(err => helper.handle(message, err))
}

const admin_commands = {
    "prefix": require("./admin/prefix"),
    "cooldowns": require("./admin/cooldowns")
};

module.exports = (message, client, helper) => {
    if (message.member.permission.json.manageMessages) {
        let options = message.content.split(" ");
        const command = options.slice(1, options.length)[0];
        message.content = options.slice(2, options.length).join(" ");
        if (command in admin_commands) {
            admin_commands[command](message, client, helper);
        } else {
            message.channel.createMessage({
                "embed": {
                    "description": [
                        `Channel-specifc cooldowns: \`${message.gcfg.climit / 1000}\``,
                        `Member-specific cooldowns: \`${message.gcfg.mlimit / 1000}\``,
                        `Custom prefix: \`${message.gcfg.prefix}\``
                    ].join("\n")
                }
            }).then(() => {
                helper.log(message, "sent current admin stuff");
            }).catch(err => helper.handle(message, err));
        }
    } else {
        helper.log(message, "permissions error");
    }
};

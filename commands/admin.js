const admin_commands = {
    "prefix": require("./admin/prefix"),
    "cooldowns": require("./admin/cooldowns"),
    "disable": require("./admin/disable"),
    "enable": require("./admin/enable")
};

module.exports = (message, client, helper) => {
    if (message.member.permission.json.manageMessages) {
        let options = message.content.split(" ");
        const command = options.slice(1, options.length)[0];
        message.content = options.slice(2, options.length).join(" ");
        if (command in admin_commands) {
            admin_commands[command](message, client, helper);
        } else {
            let disabledlist = message.gcfg.disabled[message.channel.id];
            let prettylist = disabledlist.map(item => `\`${item}\``).join(" ");
            prettylist = disabledlist.length > 0 ? `Disabled commands here: ${prettylist}` : "No disabled commands in this channel.";
            message.channel.createMessage({
                "embed": {
                    "description": [
                        `Channel-specifc cooldowns: \`${message.gcfg.climit / 1000}\``,
                        `Member-specific cooldowns: \`${message.gcfg.mlimit / 1000}\``,
                        `Custom prefix: \`${message.gcfg.prefix}\``,
                        prettylist
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

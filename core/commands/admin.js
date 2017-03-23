module.exports = (message, client, helper) => {
    if (message.member.permission.json.manageMessages) {
        delete client.gcfg[message.channel.guild.id];
        let options = message.content.split(" ");
        const command = options.slice(1, options.length)[0];
        message.content = options.slice(2, options.length).join(" ");
        if (command in client.core.commands._admin) {
            client.core.commands._admin[command](message, client, helper);
        } else {
            let disabled_list = message.gcfg.disabled ? message.gcfg.disabled[message.channel.id] : undefined;
            let prettylist = disabled_list ? disabled_list.map(item => `\`${item}\``).join(" ") : "";
            prettylist = prettylist.length > 0 ? `Disabled commands here: ${prettylist}` : "No disabled commands in this channel.";
            message.channel.createMessage({
                "embed": {
                    "description": [
                        `Channel-specifc cooldowns: \`${message.gcfg.climit}\``,
                        `Member-specific cooldowns: \`${message.gcfg.mlimit}\``,
                        `Custom prefix: \`${message.gcfg.prefix}\``,
                        `Trivia Channel: ${message.gcfg.trivia == 0 ? "none" : "<#" + message.gcfg.trivia + ">"}`,
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

module.exports = (message, client, helper) => {
    let locale = client.core.locale[message.gcfg.locale].com.admin.main;

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
            prettylist = prettylist.length > 0 ? client.sprintf(locale.disa, prettylist) : locale.nodisa;
            message.channel.createMessage({
                "embed": {
                    "description": [
                        client.sprintf(locale.cspcd, message.gcfg.climit),
                        client.sprintf(locale.mspcd, message.gcfg.mlimit),
                        client.sprintf(locale.cuspre, message.gcfg.prefix),
                        client.sprintf(locale.tricha, message.gcfg.trivia == 0 ? "none" : "<#" + message.gcfg.trivia + ">"),
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

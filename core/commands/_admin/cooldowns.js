module.exports = (message, client, helper) => {
    let locale = client.core.locale[message.gcfg.locale].com.admin.cooldowns;

    if (message.content) {
        let options = message.content.split(" ");
        if (["channel", "member"].indexOf(options[0]) != -1 && !isNaN(options[1])) {
            let limit = options[1];

            client.pg.query({
                "text": `UPDATE public.guilds SET ${options[0].charAt(0)}limit = $1 WHERE id = $2`,
                "values": [limit, message.channel.guild.id]
            }).then(() => {
                message.channel.createMessage(client.sprintf(locale.confirm, locale[options[0]], options[1])).then(() => {
                    helper.log(message, "set new cooldowns");
                }).catch(err => helper.handle(message, err));
            }).catch(err => {
                helper.log(message, "something went wrong updating a config");
                helper.log(message, err);
            });
        }
    }
};

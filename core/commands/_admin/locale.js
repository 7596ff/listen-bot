module.exports = (message, client, helper) => {
    let locale = client.core.locale[message.gcfg.locale].com.admin.locale;

    if (message.content) {
        let available = Object.keys(client.core.locale);
        if (available.includes(message.content)) {
            client.pg.query({
                "text": "UPDATE public.guilds SET locale = $1 WHERE id = $2",
                "values": [message.content, message.channel.guild.id]
            }).then(() => {
                message.channel.createMessage(client.sprintf(locale.confirm, message.content)).then(() => {
                    helper.log(message, `changed guild locale to ${message.content}`);
                }).catch(err => helper.handle(message, err));
            }).catch(err => {
                helper.log(message, "something went wrong with updating locale");
                helper.log(message, err);
            });
        } else {
            message.channel.createMessage(client.sprintf(locale.error, available.join(", "))).catch((err) => helper.handle(err));
        }
    }
};

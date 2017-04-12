module.exports = (message, client, helper) => {
    let locale = client.core.locale[message.gcfg.locale].com.admin.botspam;

    if (message.content) {

        let channel = message.channelMentions.length ? message.channelMentions[0] : 0;

        client.pg.query({
            "text": "UPDATE public.guilds SET botspam = $1 WHERE id = $2",
            "values": [channel, message.channel.guild.id]
        }).then(() => {
            channel = channel == 0 ? "`none`" : `<#${channel}>`;
            message.channel.createMessage(client.sprintf(locale.confirm, channel)).then(() => {
                helper.log(message, `changed guild botspam channel to ${channel}`);
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, "something went wrong with updating botspam channel");
            helper.log(message, err);
        });
    }
};

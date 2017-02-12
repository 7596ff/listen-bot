module.exports = (message, client, helper) => {
    if (message.content) {
        let newprefix = message.content.replace("\"", "");

        client.pg.query({
            "text": "UPDATE public.guilds SET prefix = $1 WHERE id = $2",
            "values": [newprefix, message.channel.guild.id]
        }).then(() => {
            message.channel.createMessage(`:ok_hand: prefix set to \`${newprefix}\``).then(() => {
                helper.log(message, `changed guild prefix to ${newprefix}`);
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, "something went wrong with updating prefix");
            helper.log(message, err);
        });
    }
};

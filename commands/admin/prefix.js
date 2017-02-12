module.exports = (message, client, helper) => {
    if (message.content) {
        let newprefix = message.content.replace("\"", "");

        let qstring = [
            "UPDATE public.guilds",
            `SET prefix = '${newprefix}'`,
            `WHERE id = '${message.channel.guild.id}';`
        ];
        client.pg.query(qstring.join(" ")).then(() => {
            client.createMessage(message.channel.id, `:ok_hand: prefix set to \`${newprefix}\``).then(() => {
                helper.log(message, `changed guild prefix to ${newprefix}`);
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, "something went wrong with updating prefix");
            helper.log(message, err);
        });

    }
};

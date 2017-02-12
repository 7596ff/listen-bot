module.exports = (message, client, helper) => {
    if (message.content) {
        let options = message.content.split(" ");
        if (["channel", "member"].indexOf(options[0]) != -1 && !isNaN(options[1])) {
            let limit = options[1] * 1000;
            let letter = options[0].substring(0, 1);

            let qstring = [
                "UPDATE public.guilds",
                `SET ${letter}limit = '${limit}'`,
                `WHERE id = '${message.channel.guild.id}';`
            ];
            client.pg.query(qstring.join(" ")).then(() => {
                client.createMessage(message.channel.id, `:ok_hand: Set ${options[0]} limit to ${options[1]} seconds.`).then(() => {
                    helper.log(message, "set new cooldowns");
                }).catch(err => helper.handle(message, err));
            }).catch(err => {
                helper.log(message, "something went wrong updating a config");
                helper.log(message, err);
            });
        }
    }
};

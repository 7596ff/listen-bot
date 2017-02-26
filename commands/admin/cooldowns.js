module.exports = (message, client, helper) => {
    if (message.content) {
        let options = message.content.split(" ");
        if (["channel", "member"].indexOf(options[0]) != -1 && !isNaN(options[1])) {
            let limit = options[1];

            if (options[0] == "channel") {
                client.pg.query({
                    "text": "UPDATE public.guilds SET climit = $1 WHERE id = $2",
                    "values": [limit, message.channel.guild.id]
                }).then(() => {
                    message.channel.createMessage(`:ok_hand: Set ${options[0]} limit to ${options[1]} seconds.`).then(() => {
                        helper.log(message, "set new cooldowns");
                    }).catch(err => helper.handle(message, err));
                }).catch(err => {
                    helper.log(message, "something went wrong updating a config");
                    helper.log(message, err);
                });
            }

            if (options[0] == "member") {
                client.pg.query({
                    "text": "UPDATE public.guilds SET mlimit = $1 WHERE id = $2",
                    "values": [limit, message.channel.guild.id]
                }).then(() => {
                    message.channel.createMessage(`:ok_hand: Set ${options[0]} limit to ${options[1]} seconds.`).then(() => {
                        helper.log(message, "set new cooldowns");
                    }).catch(err => helper.handle(message, err));
                }).catch(err => {
                    helper.log(message, "something went wrong updating a config");
                    helper.log(message, err);
                });
            }
        }
    }
};

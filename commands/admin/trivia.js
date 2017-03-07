module.exports = (message, client, helper) => {
    if (message.channelMentions && message.channelMentions.length == 1) {
        client.pg.query({
            "text": "UPDATE public.guilds SET trivia = $1 WHERE id = $2",
            "values": [message.channelMentions[0], message.channel.guild.id]
        }).then(() => {
            message.channel.createMessage(`:ok_hand: trivia enabled in <#${message.channelMentions[0]}>`).then(() => {
                helper.log(message, `changed trivia channel to ${message.channelMentions[0]}`);
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, "something went wrong with updating trivia channel");
            helper.log(message, err);
        });
    } else {
        client.pg.query({
            "text": "UPDATE public.guilds SET trivia = $1 WHERE id = $2",
            "values": [0, message.channel.guild.id]
        }).then(() => {
            message.channel.createMessage(":ok_hand: trivia disabled").then(() => {
                helper.log(message, "removed trivia channel");
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, "something went wrong with updating trivia channel");
            helper.log(message, err);
        });
    }
};

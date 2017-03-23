module.exports = (message, client, helper) => {
    client.core.templates.stats(client).then(embed => {
        message.channel.createMessage({
            "embed": embed
        }).then(() => {
            helper.log(message, "sent stats");
        }).catch(err => helper.handle(message, err));
    });
};

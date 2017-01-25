module.exports = (message, client, helper) => {
    client.createMessage(message.channel.id, {
        "embed": require('../util/stats_helper')(client)
    }).then(new_message => {
        helper.log(message, "sent stats")
    }).catch(err => helper.handle(message, err))
}

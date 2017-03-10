module.exports = (message, client, helper) => {
    message.channel.createMessage(message.timestamp).then(new_m => {
        new_m.edit(`:ping_pong: Pong! Message send latency: \`${new_m.timestamp - message.timestamp} ms\``).catch(err => helper.handle(message, err));
    }).catch(err => helper.handle(message, err));
};

module.exports = (message, client, helper) => {
    message.channel.createMessage(rec).then(new_m => {
        new_m.edit(`:ping_pong: Pong! Message send latency: \`${new_m.timestamp - message.timestamp} ms\``).catch(err => helper.handle(message, err));
    }).catch(err => helper.handle(message, err));
};

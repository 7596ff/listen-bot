module.exports = (message, client, helper) => {
    let rec = Date.now();
    message.channel.createMessage(rec).then(new_m => {
        new_m.edit(`:ping_pong: Pong! Message send latency: \`${new_m.timestamp - rec} ms\``).catch(err => helper.handle(message, err));
    }).catch(err => helper.handle(message, err));
};

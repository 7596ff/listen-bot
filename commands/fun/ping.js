async function exec(ctx) {
    let msg = await ctx.send(ctx.message.timestamp);
    return msg.edit(`:ping_pong: Pong! Message send latency: \`${msg.timestamp - ctx.message.timestamp} ms\``);
}

module.exports = {
    name: "ping",
    category: "fun",
    exec
};

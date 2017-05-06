async function exec(ctx) {
    return ctx.send(`:ping_pong: Shard latency: \`${ctx.guild.shard.latency} ms\``);
}

module.exports = {
    name: "pong",
    category: "fun",
    exec
};

async function exec(ctx) {
    return ctx.send(ctx.strings.get("pong", ctx.guild.shard.latency));
}

module.exports = {
    name: "pong",
    category: "utility",
    exec
};

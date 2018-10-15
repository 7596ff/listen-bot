async function exec(ctx) {
    let msg = await ctx.send(ctx.message.timestamp);
    return msg.edit(ctx.strings.get("ping_edit", msg.timestamp - ctx.message.timestamp));
}

module.exports = {
    name: "ping",
    category: "utility",
    exec
};

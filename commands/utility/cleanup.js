async function exec(ctx) {
    try {
        let ids = ctx.channel.messages
            .filter((message) => message.author.id == ctx.client.user.id)
            .map((message) => message.id);

        for (let id in ids) {
            try { await ctx.client.deleteMessage(ctx.channel.id, id) } catch (err) {}
        }

        return ctx.delete(5000, ":white_check_mark:");
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "cleanup",
    category: "utility",
    exec
};

async function exec(ctx) {
    try {
        let ids = ctx.channel.messages
            .filter((message) => message.author.id == ctx.client.user.id)
            .map((message) => message.id);

        let promises = ids.map((id) => ctx.client.deleteMessage(ctx.channel.id, id));
        await Promise.all(promises);
        return ctx.delete(5000, ":white_check_mark:");
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.trings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "cleanup",
    category: "utility",
    exec
};

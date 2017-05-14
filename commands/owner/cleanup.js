async function exec(ctx) {
    try {
        let ids = ctx.channel.messages
            .filter((message) => message.author.id == ctx.client.user.id)
            .map((message) => message.id);

        await ctx.channel.deleteMessages(ids);
        return ctx.delete(5000, ":white_check_mark:");
    } catch (err) {
        console.error(err);
        return ctx.failure(ctx.trings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "cleanup",
    category: "owner",
    exec
};

async function exec(ctx) {
    try {
        let res = await ctx.client.pg.query({
            text: "SELECT * FROM public.users WHERE id = $1;",
            values: [ctx.author.id]
        });

        if (res.rows.length) {
            await ctx.client.pg.query({
                text: "DELETE FROM public.users WHERE id = $1;",
                values: [ctx.author.id]
            });

            await ctx.client.pg.query({
                text: "DELETE FROM subs WHERE value = $1;",
                values: [res.rows[0].dotaid]
            });

            return ctx.success(ctx.strings.get("unregister_success"));
        } else {
            return ctx.failure(ctx.strings.get("unregister_no_account"));
        }
    } catch (err) {
        ctx.error(err);
        ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "unregister",
    category: "personal",
    exec
};

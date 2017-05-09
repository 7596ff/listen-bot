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

            return ctx.success(ctx.strings.get("unregister_success"));
        } else {
            return ctx.failure(ctx.strings.get("unregister_no_account"));
        }
    } catch (err) {
        console.error(err);
        return ctx.send("Something went wrong.");
    }
}

module.exports = {
    name: "unregister",
    category: "personal",
    exec
};

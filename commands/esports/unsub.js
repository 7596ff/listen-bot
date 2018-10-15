const Unwatcher = require("../../classes/unwatcher");

async function checks(client, member) {
    return member.permission.has("manageMessages");
}

async function exec(ctx) {
    if (ctx.options[0] == "nuke") {
        try {
            let res = await ctx.client.pg.query({
                text: "DELETE FROM subs WHERE channel = $1;",
                values: [ctx.channel.id]
            });

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                action: "refresh"
            }));

            return ctx.success(ctx.strings.get("unsub_nuke_success", res.rowCount, ctx.channel.mention));
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    }

    if (ctx.options[0] == "stacks") {
        try {
            let res = await ctx.client.pg.query({
                text: "DELETE FROM subs WHERE owner = $1;",
                values: [ctx.guild.id]
            });

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                action: "refresh"
            }));

            return ctx.success(ctx.strings.get("unsub_success", "stacks"));
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    }

    try {
        let res = await ctx.client.pg.query({
            "text": "SELECT * FROM subs WHERE channel = $1;",
            "values": [ctx.channel.id]
        });

        let currentSubs = [];

        if (res.rows.find((row) => row.owner === ctx.guild.id)) {
            currentSubs.push("stacks");
        }

        currentSubs.push(...res.rows.filter((row) => row.owner === ctx.author.id).map((row) => `${row.type}:${row.value}`));

        if (currentSubs.length) {
            let submap = currentSubs.map((sub, index) => `${index}: \`${sub}\``).join(", ");
            let msg = [
                ctx.strings.get("unsub_message_1", ctx.author.mention),
                "",
                submap,
                "",
                ctx.strings.get("unsub_message_3"),
                ctx.strings.get("unsub_message_4", ctx.gcfg.prefix)
            ].join("\n");
            
            await ctx.send(msg);
            ctx.client.unwatchers[`${ctx.channel.id}:${ctx.author.id}`] = new Unwatcher(ctx, currentSubs);
            return Promise.resolve();
        } else {
            return ctx.failure(ctx.strings.get("unsub_no_feeds", ctx.author.mention));
        }
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "unsub",
    category: "esports",
    checks,
    exec
};

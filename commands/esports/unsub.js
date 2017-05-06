const Unwatcher = require("../../classes/unwatcher");

async function checks(client, member) {
    return member.permission.has("manageMessages");
}

async function exec(ctx) {
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
                `Current subscriptions in this channel owned by ${ctx.author.mention}:`,
                submap,
                "To unsubscribe from a subscription, type the number associated with the subscription. This will time out in 60 seconds."
            ].join("\n");
            
            await ctx.send(msg);
            ctx.client.unwatchers[`${ctx.channel.id}:${ctx.author.id}`] = new Unwatcher(ctx.message, ctx.client, ctx.helper, currentSubs);
            return Promise.resolve();
        } else {
            return ctx.send(`:x: ${ctx.author.mention} has no feeds subscribed to in this channel.`);
        }
    } catch (err) {
        console.error(err);
        return ctx.send(":x: Something went wrong. The error has been logged.");
    }
}

module.exports = {
    name: "unsub",
    category: "esports",
    checks,
    exec
};

const types = ["player"];
const map = types.map((type) => `\`${type}\``).join(", ");

async function unsub(message, client, helper) {
    let locale = client.core.locale[message.gcfg.locale];

    if (!message.member.permission.has("manageMessages")) {
        message.channel.createMessage("Manage Messages is required to create and remove subscriptions.").catch((err) => helper.handle(message, err));
    }

    try {
        let res = await client.pg.query({
            "text": "SELECT * FROM subs WHERE channel = $1;",
            "values": [message.channel.id]
        });
        let currentSubs = [];

        if (res.rows.find((row) => row.owner === message.channel.guild.id)) {
            currentSubs.push("stacks");
        }

        currentSubs.push(...res.rows.filter((row) => row.owner === message.author.id).map((row) => `${row.type}:${row.value}`));

        if (currentSubs.length) {
            let submap = currentSubs.map((sub, index) => `${index}: \`${sub}\``).join(", ");
            let msg = [
                `Current subscriptions in this channel owned by ${message.author.mention}:`,
                submap,
                "To unsubscribe from a subscription, type the number associated with the subscription. This will time out in 60 seconds."
            ].join("\n");
            message.channel.createMessage(msg).catch((err) => helper.handle(message, err)).then((msg) => {
                client.unwatchers[`${message.channel.id}:${message.author.id}`] = new client.core.util.unwatcher(message, client, helper, currentSubs);
            });
        } else {
            message.channel.createMessage(`:x: ${message.author.mention} has no feeds subscribed to in this channel.`)
                .catch((err) => helper.handle(message, err));
        }
    } catch (err) {
        helper.log(message, err, "err");
        message.channel.createMessage(":x: Something went wrong selecting the subscriptions from this channel. The error has been logged.")
            .catch((err) => helper.handle(err));
    }
}

module.exports = unsub;

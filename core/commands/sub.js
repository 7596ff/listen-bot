const types = ["player"];
const map = types.map((type) => `\`${type}\``).join(", ");

async function sub(message, client, helper) {
    let locale = client.core.locale[message.gcfg.locale];

    if (!message.member.permission.has("manageMessages")) {
        return message.channel.createMessage(":x: Manage Messages is required to create and remove subscriptions.")
            .catch((err) => helper.handle(message, err));
    }

    const type = message.content.split(" ")[1];

    if (!type) {
        return message.channel.createMessage(client.sprintf(":x: Type is a required argument that is missing. Try `%shelp sub`.", message.gcfg.prefix))
            .catch((err) => helper.handle(message, err));
    }

    if (!types.includes(type)) {
        return message.channel.createMessage(`:x: This type of subscription is not supported. Currently available type(s): ${map}`)
            .catch((err) => helper.handle(message, err));
    }

    const item = message.content.split(" ").slice(2).join(" ");

    if (type == "player") {
        if (message.mentions.length != 1) {
            return message.channel.createMessage(":x: Please supply one player mention to subscribe to.")
                .catch((err) => helper.handle(message, err));
        }

        let dotaID;
        try {
            dotaID = await client.core.util.resolve_dota_id(locale.resolve_dota_id, message, message.mentions[0].id)    
        } catch (err) {
            helper.log(message, err.log || err.err);
            return message.channel.createMessage(err.text).catch((err) => helper.handle(message, err));
        }

        let res;
        try {
            res = await client.pg.query({
                "text": "SELECT * FROM subs WHERE (owner = $1 AND channelid = $2 AND dotaid = $3);",
                "values": [message.member.id, message.channel.id, dotaID]
            });

            if (res.rowCount > 0) {
                return message.channel.createMessage(":x: There is already a subscription for this player in this channel.")
                    .catch((err) => helper.handle(message, err));
            }

            res = await client.pg.query({
                "text": "INSERT INTO subs (date, owner, channelid, dotaid) VALUES ($1, $2, $3, $4);",
                "values": [Date.now(), message.member.id, message.channel.id, dotaID]
            });

            client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": "dotaid",
                "id": dotaID
            }));

            helper.log(message, "added a subscription");
            message.channel.createMessage("This subscription has been added.")
                .catch((err) => helper.handle(message, err));
        } catch (err) {
            helper.log(message, err, "err");
            message.channel.createMessage(":x: Something went wrong adding this subscription. The error has been logged.")
                .catch((err) => helper.handle(message, err));
        }
    }
}

module.exports = sub;

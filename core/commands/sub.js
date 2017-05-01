const newsfeeds = ["belvedere", "cyborgmatt", "blog", "steamnews"];
const newsmap = newsfeeds.map((type) => `\`${type}\``).join(", ");

const subcommands = {
    "player": async function(message, client, helper, type, item) {
        if (message.mentions.length != 1) {
            return message.channel.createMessage(":x: Please mention one player to subscribe to.")
                .catch((err) => helper.handle(message, err));
        }

        let dotaID;
        try {
            dotaID = await client.core.util.resolve_dota_id(client.core.locale[message.gcfg.locale].resolve_dota_id, message, message.mentions[0].id);
        } catch (err) {
            helper.log(message, err.log || err, "err");
            return message.channel.createMessage(err.text).catch((err) => helper.handle(message, err));
        }

        try {
            let res = await client.pg.query({
                "text": [
                    "INSERT INTO public.subs (mess, owner, channel, type, value) VALUES ($1, $2, $3, $4, $5)",
                    "ON CONFLICT (mess) DO NOTHING;"
                ].join(" "),
                "values": [`${message.channel.id}:player:${dotaID}`, message.author.id, message.channel.id, "player", dotaID]
            });

            client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": "player",
                "ids": dotaID
            }));

            helper.log(message, "added a player subscription");
            return message.channel.createMessage(":white_check_mark: This subscription has been added.")
                .catch((err) => helper.handle(message, err));

        } catch (err) {
            console.error(err);
            message.channel.createMessage(":x: Something went wrong inserting this subscription. The error has been logged.")
                .catch((err) => helper.handle(message, err));
        }
    },
    "team": async function(message, client, helper, type, item) {
        if (!item || isNaN(item)) {
            return message.channel.createMessage("Please provide a team ID. Check out <https://www.dotabuff.com/esports/teams> for a list of teams.").catch((err) => helper.handle(message, err));
        }

        try {
            let res = await client.pg.query({
                "text": [
                    "INSERT INTO public.subs (mess, owner, channel, type, value) VALUES ($1, $2, $3, $4, $5)", 
                    "ON CONFLICT (mess) DO NOTHING;"
                ].join(" "),
                "values": [`${message.channel.id}:${type}:${item}`, message.author.id, message.channel.id, type, item]
            });

            client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            helper.log(message, `subbed to ${type}:${item}`);
            return message.channel.createMessage(":white_check_mark: This subscription has been added.")
                .catch((err) => helper.handle(message, err));
        } catch (err) {
            helper.log(message, err, "err");
            message.channel.createMessage(":x: Something went wrong inserting this subscription. The error has been logged.")
                .catch((err) => helper.handle(message, err));
        }
    },
    "league": async function(message, client, helper, type, item) {
        if (!item || isNaN(item)) {
            return message.channel.createMessage("Please provide a league ID. Check out <https://www.dotabuff.com/esports/leagues> for a list of leagues.").catch((err) => helper.handle(message, err));
        }

        try {
            let res = await client.pg.query({
                "text": [
                    "INSERT INTO public.subs (mess, owner, channel, type, value) VALUES ($1, $2, $3, $4, $5)", 
                    "ON CONFLICT (mess) DO NOTHING;"
                ].join(" "),
                "values": [`${message.channel.id}:${type}:${item}`, message.author.id, message.channel.id, type, item]
            });

            client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            helper.log(message, `subbed to ${type}:${item}`);
            return message.channel.createMessage(":white_check_mark: This subscription has been added.")
                .catch((err) => helper.handle(message, err));
        } catch (err) {
            helper.log(message, err, "err");
            message.channel.createMessage(":x: Something went wrong inserting this subscription. The error has been logged.")
                .catch((err) => helper.handle(message, err));
        }
    },
    "newsfeed": async function(message, client, helper, type, item) {
        if (!newsfeeds.includes(item)) {
            message.channel.createMessage(`:x: This newsfeed subscription is not available. Available newsfeed subscriptions: ${newsmap}`)
                .catch((err) => helper.handle(message, err));
        } else {
            try {
                let res = await client.pg.query({
                    "text": [
                        "INSERT INTO public.subs (mess, owner, channel, type, value) VALUES ($1, $2, $3, $4, $5)", 
                        "ON CONFLICT (mess) DO NOTHING;"
                    ].join(" "),
                    "values": [`${message.channel.id}:${type}:${item}`, message.author.id, message.channel.id, type, item]
                });

                helper.log(message, `subbed to ${type}:${item}`);
                return message.channel.createMessage(":white_check_mark: This subscription has been added.")
                    .catch((err) => helper.handle(message, err));
            } catch (err) {
                helper.log(message, err, "err");
                message.channel.createMessage(":x: Something went wrong inserting this subscription. The error has been logged.")
                    .catch((err) => helper.handle(message, err));
            }
        }
    }
}

const map = Object.keys(subcommands).map((type) => `\`${type}\``).join(", ");

async function sub(message, client, helper) {
    let locale = client.core.locale[message.gcfg.locale];

    if (!message.member.permission.has("manageMessages")) {
        return message.channel.createMessage(":x: Manage Messages is required to create and remove subscriptions.")
            .catch((err) => helper.handle(message, err));
    }

    const type = message.content.split(" ")[1];

    if (!type) {
        return message.channel.createMessage(`:x: Type is a required argument that is missing. Currently available type(s): ${map}`)
            .catch((err) => helper.handle(message, err));
    }

    if (subcommands.hasOwnProperty(type)) {
        const item = message.content.split(" ").slice(2).join(" ");
        subcommands[type](message, client, helper, type, item);
    } else {
        return message.channel.createMessage(`:x: This type of subscription is not supported. Currently available type(s): ${map}`)
            .catch((err) => helper.handle(message, err));
    }
}

module.exports = sub;

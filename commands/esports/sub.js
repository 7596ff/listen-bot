const checkDiscordID = require("../../util/checkDiscordID");

const newsfeeds = ["belvedere", "cyborgmatt", "blog", "steamnews"];
const newsmap = newsfeeds.map((type) => `\`${type}\``).join(", ");

async function query(pg, values) {
    return pg.query({
        text: [
            "INSERT INTO public.subs (mess, owner, channel, type, value) VALUES ($1, $2, $3, $4, $5)",
            "ON CONFLICT (mess) DO NOTHING;"
        ].join(" "),
        values: values
    });
}

const subcommands = {
    player: async function(ctx, type, item) {
        if (ctx.message.mentions.length != 1) {
            return ctx.send(":x: Please mention one player to subscribe to.");
        }

        let dotaID;
        try {
            dotaID = await checkDiscordID(ctx.client.pg, ctx.message.mentions[0].id);
        } catch (err) {
            console.error(err);
            return ctx.send("not registered placeholder");
        }

        try {
            let res = await query(ctx.client.pg, [`${ctx.channel.id}:player:${dotaID}`, ctx.author.id, ctx.channel.id, "player", dotaID]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": "player",
                "ids": dotaID
            }));

            return ctx.send(":white_check_mark: This subscription has been added.");
        } catch (err) {
            console.error(err);
            return ctx.send(":x: Something went wrong inserting this subscription. The error has been logged.")
        }
    },
    team: async function(ctx, type, item) {
        if (!item || isNaN(item)) {
            return ctx.send("Please provide a team ID. Check out <https://www.dotabuff.com/esports/teams> for a list of teams.");
        }

        try {
            let res = await query(ctx.client.pg, [`${ctx.channel.id}:${type}:${item}`, ctx.author.id, ctx.channel.id, type, item]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            return ctx.send(":white_check_mark: This subscription has been added.");
        } catch (err) {
            console.error(err);
            return ctx.send(":x: Something went wrong inserting this subscription. The error has been logged.");
        }
    },
    league: async function(ctx, type, item) {
        if (!item || isNaN(item)) {
            return ctx.send("Please provide a league ID. Check out <https://www.dotabuff.com/esports/leagues> for a list of leagues.").catch((err) => helper.handle(message, err));
        }

        try {
            let res = await query(ctx.client.pg, [`${ctx.channel.id}:${type}:${item}`, ctx.author.id, ctx.channel.id, type, item]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            return ctx.send(":white_check_mark: This subscription has been added.");
        } catch (err) {
            console.error(err);
            return ctx.send(":x: Something went wrong inserting this subscription. The error has been logged.");
        }
    },
    newsfeed: async function(ctx, type, item) {
        if (!newsfeeds.includes(item)) {
            return ctx.send(`:x: This newsfeed subscription is not available. Available newsfeed subscriptions: ${newsmap}`);
        } else {
            try {
                let res = await query(ctx.client.pg, [`${ctx.channel.id}:${type}:${item}`, ctx.author.id, ctx.channel.id, type, item]);

                return ctx.send(":white_check_mark: This subscription has been added.")
            } catch (err) {
                console.error(err);
                return ctx.send(":x: Something went wrong inserting this subscription. The error has been logged.");
            }
        }
    }
}

const map = Object.keys(subcommands).map((type) => `\`${type}\``).join(", ");

async function checks(client, member) {
    return member.permission.has("manageMessages");
}

async function exec(ctx) {
    const type = ctx.options[0];

    if (!type) {
        return ctx.send(`:x: Type is a required argument that is missing. Currently available type(s): ${map}`);
    }

    if (subcommands.hasOwnProperty(type)) {
        const item = ctx.options[1];
        return subcommands[type](ctx, type, item);
    } else {
        return ctx.send(`:x: This type of subscription is not supported. Currently available type(s): ${map}`);
    }
}

module.exports = {
    name: "sub",
    category: "esports",
    checks,
    exec
}
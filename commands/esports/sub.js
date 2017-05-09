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
            return ctx.failure(ctx.strings.get("sub_invalid_syntax"));
        }

        let dotaID;
        try {
            dotaID = await checkDiscordID(ctx.client.pg, ctx.message.mentions[0].id);
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("bot_not_registered", ctx.message.mentions[0].username), ctx.gcfg.prefix);
        }

        try {
            let res = await query(ctx.client.pg, [`${ctx.channel.id}:player:${dotaID}`, ctx.author.id, ctx.channel.id, "player", dotaID]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": "player",
                "ids": dotaID
            }));

            return ctx.success(ctx.strings.get("sub_success"));
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
        }
    },
    team: async function(ctx, type, item) {
        if (!item || isNaN(item)) {
            return ctx.failure(ctx.strings.get("sub_team_id"));
        }

        try {
            let res = await query(ctx.client.pg, [`${ctx.channel.id}:${type}:${item}`, ctx.author.id, ctx.channel.id, type, item]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            return ctx.success(ctx.strings.get("sub_success"));
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
        }
    },
    league: async function(ctx, type, item) {
        if (!item || isNaN(item)) {
            return ctx.failure(ctx.strings.get("sub_league_id"));
        }

        try {
            let res = await query(ctx.client.pg, [`${ctx.channel.id}:${type}:${item}`, ctx.author.id, ctx.channel.id, type, item]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            return ctx.success(ctx.strings.get("sub_success"));
        } catch (err) {
            console.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
        }
    },
    newsfeed: async function(ctx, type, item) {
        if (!newsfeeds.includes(item)) {
            return ctx.failure(ctx.strings.get("sub_wrong_newsfeed", newsmap));
        } else {
            try {
                let res = await query(ctx.client.pg, [`${ctx.channel.id}:${type}:${item}`, ctx.author.id, ctx.channel.id, type, item]);

                return ctx.success(ctx.strings.get("sub_success"));
            } catch (err) {
                console.error(err);
                return ctx.failure(ctx.strings.get("sub_failure"));
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
        return ctx.failure(ctx.strings.get("sub_no_type", map));
    }

    if (subcommands.hasOwnProperty(type)) {
        const item = ctx.options[1];
        return subcommands[type](ctx, type, item);
    } else {
        return ctx.failure(ctx.strings.get("sub_wrong_type"));
    }
}

module.exports = {
    name: "sub",
    category: "esports",
    checks,
    exec
};

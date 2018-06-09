const checkDiscordID = require("../../util/checkDiscordID");

const newsfeeds = ["belvedere", "wykrhm", "blog", "steamnews", "magesunite"];
const newsmap = newsfeeds.map((type) => `\`${type}\``).join(", ");

async function query(pg, values) {
    return pg.query({
        text: [
            "INSERT INTO public.subs (owner, channel, type, value) VALUES ($1, $2, $3, $4)",
            "ON CONFLICT DO NOTHING;"
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
            ctx.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
        }

        if (!dotaID) {
            return ctx.failure(ctx.strings.get("bot_not_registered", ctx.message.mentions[0].username, ctx.gcfg.prefix));
        }

        try {
            let res = await query(ctx.client.pg, [ctx.author.id, ctx.channel.id, "player", dotaID]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": "player",
                "ids": dotaID
            }));

            return ctx.success(ctx.strings.get("sub_success"));
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
        }
    },
    team: async function(ctx, type, item) {
        if (!item || isNaN(item)) {
            return ctx.failure(ctx.strings.get("sub_team_id"));
        }

        try {
            let res = await query(ctx.client.pg, [ctx.author.id, ctx.channel.id, type, item]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            return ctx.success(ctx.strings.get("sub_success"));
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
        }
    },
    league: async function(ctx, type, item) {
        if (!item || isNaN(item)) {
            return ctx.failure(ctx.strings.get("sub_league_id"));
        }

        try {
            let res = await query(ctx.client.pg, [ctx.author.id, ctx.channel.id, type, item]);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                "action": "add",
                "type": type,
                "ids": item
            }));

            return ctx.success(ctx.strings.get("sub_success"));
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
        }
    },
    newsfeed: async function(ctx, type, item) {
        if (!newsfeeds.includes(item)) {
            return ctx.failure(ctx.strings.get("sub_wrong_newsfeed", newsmap));
        } else {
            try {
                let res = await query(ctx.client.pg, [ctx.author.id, ctx.channel.id, type, item]);

                return ctx.success(ctx.strings.get("sub_success"));
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("sub_failure"));
            }
        }
    },
    stacks: async function(ctx, type) {
        try {
            await ctx.client.pg.query({
                text: "DELETE FROM subs WHERE owner = $1;",
                values: [ctx.guild.id]
            });

            let users = await ctx.client.pg.query("SELECT * FROM public.users;");
            users = users.rows.filter((user) => ctx.guild.members.get(user.id));
            users.push({ dotaid: 1 });

            let promises = users.map((user) => query(ctx.client.pg, [ctx.guild.id, ctx.channel.id, "player", user.dotaid]));
            let results = await Promise.all(promises);

            ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                action: "refresh"
            }));

            return ctx.success(ctx.strings.get("sub_success"));
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("sub_failure"));
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
        return ctx.failure(ctx.strings.get("sub_wrong_type", map));
    }
}

module.exports = {
    name: "sub",
    category: "esports",
    checks,
    exec
};

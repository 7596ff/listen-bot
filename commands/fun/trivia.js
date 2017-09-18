const searchMembers = require("../../util/searchMembers");

const subcommands = {
    start: async function(ctx) {
        if (ctx.gcfg.trivia == ctx.channel.id && !ctx.client.trivia.channels.includes(ctx.channel.id)) {
            ctx.client.trivia.init(ctx.client, ctx.channel.id);
            return Promise.resolve();
        } else if (ctx.gcfg.trivia != 0 && ctx.channel.id != ctx.gcfg.trivia) {
            return ctx.send(ctx.strings.get("trivia_wrong_channel", ctx.gcfg.trivia));
        } else {
            return ctx.send(ctx.strings.get("trivia_no_channel", ctx.gcfg.prefix));
        }

        return Promise.resolve();
    },
    stop: async function(ctx) {
        if (ctx.client.trivia.channels.includes(ctx.channel.id)) {
            ctx.client.trivia.channels.splice(ctx.client.trivia.channels.indexOf(ctx.gcfg.trivia), 1);
            return ctx.success(ctx.strings.get("trivia_stopped"));
        }
    },
    top: async function(ctx) {
        let res;
        try {
            res = await ctx.client.pg.query("SELECT * FROM scores ORDER BY score DESC;");
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }

        let msg = [];
        let rows = res.rows;
        if (ctx.options[0] == "all") {
            msg.push(ctx.strings.get("trivia_top_ten_bot"));
        } else {
            msg.push(ctx.strings.get("trivia_top_ten_server"));
            rows = rows.filter((row) => ctx.guild.members.get(row.id));
        }

        rows = rows.slice(0, 10);

        msg = msg.concat(rows.map((row) => {
            let user = ctx.client.users.find((user) => user.id == row.id);
            return `${user ? user.username : ctx.strings.get("trivia_unkown_user")}: ${row.score}`;
        }));

        return ctx.send(msg.join("\n"));
    },
    stats: async function(ctx) {
        let res;
        try {
            res = await ctx.client.pg.query("SELECT * FROM scores ORDER BY score DESC LIMIT 1;")
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }

        let user = ctx.client.users.get(res.rows[0].id);

        return ctx.send([
            `**${ctx.strings.get("trivia_total_questions")}** ${ctx.client.trivia.questions.length}`,
            `**${ctx.strings.get("trivia_first_place")}** ${user ? user.username : ctx.strings.get("trivia_unkown_user")} - ${res.rows[0].score}`,
            `**${ctx.strings.get("trivia_concurrent_games")}** ${ctx.client.trivia.channels.length}`
        ].join("\n"));
    },
    points: async function(ctx) {
        let ID = ctx.author.id;

        if (ctx.options.length) {
            let result = await searchMembers(ctx.guild.members, ctx.options);
            if (result) ID = result.all[0];
        }

        let res;
        try {
            res = await ctx.client.pg.query("SELECT * FROM scores ORDER BY score DESC;");
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }

        let user = ctx.client.users.get(ID);
        let row = res.rows.find((row) => row.id == ID);
        let guild = res.rows.filter((row) => ctx.guild.members.get(row.id));

        if (!row) {
            return ctx.send(ctx.strings.get("trivia_has_not_played", user.username));
        }

        let embed = {
            author: {
                name: user.username,
                icon_url: user.avatarURL
            },
            description: [
                `**${ctx.strings.get("trivia_points")}** ${row.score}`,
                `**${ctx.strings.get("trivia_highest_streak")}** ${row.streak}`,
                `**${ctx.strings.get("trivia_server_rank")}** ${guild.indexOf(row) + 1}/${guild.length}`,
                `**${ctx.strings.get("trivia_global_rank")}** ${res.rows.indexOf(row) + 1}/${res.rows.length}`
            ].join("\n")
        }

        return ctx.embed(embed);
    }
}

async function exec(ctx) {
    const subcommand = ctx.options[0];

    if (subcommands.hasOwnProperty(subcommand)) {
        ctx.options = ctx.options.slice(1);
        return subcommands[subcommand](ctx);
    } else {
        return ctx.send(ctx.strings.get("bot_available_subcommands", Object.keys(subcommands).map((cmd) => `\`${cmd}\``).join(", ")));
    }
}

module.exports = {
    name: "trivia",
    category: "fun",
    exec
};

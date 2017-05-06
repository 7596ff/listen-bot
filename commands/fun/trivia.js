const searchMembers = require("../../util/searchMembers");

const subcommands = {
    start: async function(ctx) {
        if (ctx.gcfg.trivia == ctx.channel.id && !ctx.client.trivia.channels.includes(ctx.channel.id)) {
            ctx.client.trivia.init(ctx.client, ctx.channel.id);
            return Promise.resolve();
        } else if (ctx.gcfg.trivia != 0 && ctx.gcfg.gtrivia != ctx.channel.id) {
            return ctx.send(`Try this command in the trivia channel! <#${ctx.gcfg.trivia}>`);
        } else if (ctx.gcfg.trivia == 0 || ctx.gcfg.trivia == undefined) {
            return ctx.send(`This server does not have a designated trivia channel! Try \`${ctx.gcfg.prefix}help admin trivia\`.`);
        }

        return Promise.resolve();
    },
    stop: async function(ctx) {
        if (ctx.client.trivia.channels.includes(ctx.channel.id)) {
            ctx.client.trivia.channels.splice(ctx.client.trivia.channels.indexOf(ctx.gcfg.trivia), 1);
            return ctx.send(":white_check_mark: Trivia stopped.");
        }
    },
    top: async function(ctx) {
        let res;
        try {
            res = await ctx.client.pg.query("SELECT * FROM scores ORDER BY score DESC;");
        } catch (err) {
            console.error(err);
            return ctx.send("Something went wrong.");
        }

        let msg = [];
        let rows = res.rows;
        if (ctx.options[1] == "all") {
            msg.push("Top 10 users throughout the bot:");
        } else {
            msg.push("Top 10 users in this server:");
            rows = rows.filter((row) => ctx.guild.members.get(row.id));
        }

        rows = rows.slice(0, 10);

        msg.concat(rows.map((row) => {
            let user = ctx.client.users.find((user) => user.id == row.id);
            return `${user ? user.username : "Unknown user"}: ${row.score}`;
        }));

        return ctx.send(msg.join("\n"));
    },
    stats: async function(ctx) {
        let res;
        try {
            res = ctx.client.pg.query("SELECT * FROM scores ORDER BY score DESC LIMIT 1;")
        } catch (err) {
            console.error(err);
            return ctx.send("Something went wrong.")
        }

        let user = ctx.client.users.get(res.rows[0].id);

        return ctx.send([
            `**Current trivia games running:** ${ctx.client.trivia.channels.length}`,
            `**Total questions:** ${ctx.client.trivia.questions.length}`,
            `**First place:** ${user ? user.username : "Unknown user"} - ${res.rows[0].score}`
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
            console.error(err);
            return ctx.send("Something went wrong.");
        }

        let user = ctx.client.users.get(ID);
        let row = res.rows.find((row) => row.id == ID);
        let guild = res.rows.filter((row) => ctx.guild.members.get(row.id));

        if (!row) {
            return ctx.send(`${ctx.cilent.users.get(ID).username} hasn't played trivia yet!`);
        }

        let embed = {
            author: {
                name: user.username,
                icon_url: user.iconURL
            },
            description: [
                `**Points:** ${row.score}`,
                `**Highest Streak:** ${row.streak}`,
                `**Server Rank:** ${guild.indexOf(data) + 1}/${guild.length}`,
                `**Global Rank:** ${res.rows.indexOf(data) + 1}/${res.rows.length}`
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
        ctx.options[0] = "trivia";
        //return ctx.client.commands.help.exec(ctx);
        return ctx.send("heck.");
    }
}

module.exports = {
    name: "trivia",
    category: "fun",
    exec
};

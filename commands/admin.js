async function edit_trivia(pg, channel, ctx) {
    let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.trivia;

    if (ctx.client.trivia.channels.includes(ctx.gcfg.trivia)) ctx.client.trivia.channels.splice(ctx.client.trivia.channels.indexOf(ctx.gcfg.trivia), 1);

    try {
        let res = await pg.query({
            "text": "UPDATE public.guilds SET trivia = $1 WHERE id = $2",
            "values": [channel || 0, ctx.guild.id]
        });

        let msg = channel ? ctx.client.sprintf(locale.enable, channel) : locale.disable;
        return ctx.send(msg);
    } catch (err) {
        ctx.helper.log(ctx.message, "something went wrong with updating trivia channel");
        ctx.helper.log(ctx.message, err);
    }
}

const subcommands = {
    botspam: async function(ctx) {
        let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.botspam;

        if (ctx.content) {
            let channel = ctx.message.channelMentions.length ? ctx.message.channelMentions[0] : 0;

            try {
                let res = await ctx.client.pg.query({
                    "text": "UPDATE public.guilds SET botspam = $1 WHERE id = $2",
                    "values": [channel, ctx.guild.id]
                });

                channel = channel == 0 ? "`none`" : `<#${channel}>`;
                return ctx.send(ctx.client.sprintf(locale.confirm, channel));
            } catch (err) {
                ctx.helper.log(ctx.message, "something went wrong with updating botspam channel");
                ctx.helper.log(ctx.message, err);
            }
        } else {
            return ctx.send("Incorrect syntax.");
        }
    },
    cooldowns: async function(ctx) {
        let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.cooldowns;

        if (ctx.content) {
            let options = ctx.content.split(" ");
            if (["channel", "member"].indexOf(options[0]) != -1 && !isNaN(options[1])) {
                let limit = options[1];

                try {
                    let res = await ctx.client.pg.query({
                        "text": `UPDATE public.guilds SET ${options[0].charAt(0)}limit = $1 WHERE id = $2`,
                        "values": [limit, ctx.guild.id]
                    });

                    return ctx.send(ctx.client.sprintf(locale.confirm, locale[options[0]], options[1]));
                } catch (err) {
                    ctx.helper.log(ctx.message, "something went wrong updating a config");
                    ctx.helper.log(ctx.message, err);
                }
            }
        } else {
            return ctx.send("Incorrect syntax.");
        }
    },
    disable: async function(ctx) {
        let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.disable;

        let actual = [];

        let help = ctx.client.core.locale.en.com.help_topics;
        var possible = [];
        for (let cat in help) {
            if (cat != "admin" && cat != "meta") {
                for (let cmd in help[cat]) {
                    possible.push(help[cat][cmd].name);
                }
            }
        }

        for (let candidate in ctx.options) {
            if (possible.includes(ctx.options[candidate])) actual.push(ctx.options[candidate]);
        }

        try {
            let res = await ctx.client.pg.query({
                "text": "SELECT * FROM guilds WHERE id = $1",
                "values": [ctx.guild.id]
            });

            let disabled = res.rows[0].disabled || {};
            let oldlist = disabled[ctx.channel.id] || [];
            for (let item in actual) oldlist.push(actual[item]);
            let newlist = oldlist.filter((item, inc, newlist) => newlist.indexOf(item) === inc);
            disabled[ctx.channel.id] = newlist;

            await ctx.client.pg.query({
                "text": "UPDATE public.guilds SET disabled = $1 WHERE id = $2",
                "values": [disabled, ctx.guild.id]
            });

            ctx.helper.log(ctx.message, `disabled some commands, new list: ${newlist.join(" ")}`);
            let prettylist = newlist.map(item => `\`${item}\``).join(" ");
            prettylist = newlist.length > 0 ? ctx.client.sprintf(locale.confirmsome, prettylist) : prettylist = locale.confirmnone;

            return ctx.send(prettylist);
        } catch (err) {
            ctx.helper.log(ctx.message, "something went wrong with inside admin");
            ctx.helper.log(ctx.message, err);
        }
    },
    enable: async function(ctx) {
        let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.disable;

        try {
            let res = await ctx.client.pg.query({
                "text": "SELECT * FROM guilds WHERE id = $1",
                "values": [ctx.guild.id]
            });

            let disabled = res.rows[0].disabled;
            let oldlist = disabled[ctx.channel.id];

            if (!disabled || !oldlist) {
                return ctx.send("Disable some commands first!");
            }

            for (let val of ctx.options) {
                let index = oldlist.indexOf(val);
                if (index > -1) oldlist.splice(index, 1);
            }

            await ctx.client.pg.query({
                "text": "UPDATE public.guilds SET disabled = $1 WHERE id = $2",
                "values": [disabled, ctx.guild.id]
            });

            ctx.helper.log(ctx.message, `enabled some commands, new list: ${oldlist.join(" ")}`);
            let prettylist = oldlist.map(item => `\`${item}\``).join(" ");
            prettylist = oldlist.length > 0 ? ctx.client.sprintf(locale.confirmsome, prettylist) : prettylist = locale.confirmnone;
            return ctx.send(prettylist);
        } catch (err) {
            ctx.helper.log(ctx.message, "something went wrong with selecting guild from DB inside admin");
            ctx.helper.log(ctx.message, err);
        }
    },
    locale: async function(ctx) {
        let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.locale;

        if (ctx.content) {
            let available = Object.keys(ctx.client.core.locale);
            if (available.includes(ctx.content)) {

                try {
                    let res = await ctx.client.pg.query({
                        "text": "UPDATE public.guilds SET locale = $1 WHERE id = $2",
                        "values": [ctx.content, ctx.guild.id]
                    });

                    return ctx.send(ctx.client.sprintf(locale.confirm, ctx.content));
                } catch (err) {
                    ctx.helper.log(ctx.message, "something went wrong with updating locale");
                    ctx.helper.log(ctx.message, err);
                }
            } else {
                return ctx.send(ctx.client.sprintf(locale.error, available.join(", ")));
            }
        } else {
            return ctx.send("Invalid syntax.");
        }
    },
    prefix: async function(ctx) {
        let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.prefix;

        if (ctx.content) {
            try {
                let res = await ctx.client.pg.query({
                    "text": "UPDATE public.guilds SET prefix = $1 WHERE id = $2",
                    "values": [ctx.content, ctx.guild.id]
                });

                return ctx.send(ctx.client.sprintf(locale.confirm, ctx.content));
            } catch (err) {
                ctx.helper.log(ctx.message, "something went wrong with updating prefix");
                ctx.helper.log(ctx.message, err);
            }
        } else {
            return ctx.send("Invalid syntax.");
        }
    },
    trivia: async function(ctx) {
        switch(ctx.options[0]) {
        case "channel":
            if (message.channelMentions.length > 0) {
                return edit_trivia(ctx.client.pg, ctx.message.channelMentions[0], ctx);
            } else if (ctx.options.slice(1).join(" ").trim() == "here") {
                return edit_trivia(ctx.client.pg, ctx.channel.id, ctx);
            } else if (ctx.options.slice(1).join(" ").trim() == "none") {
                return edit_trivia(ctx.client.pg, null, ctx);
            }
            break;
        default:
            ctx.content = "help admin trivia";
            return ctx.client.core.commands.help.exec(ctx);
            break;
        }
    }
}

async function checks(client, member) {
    return member.permission.has("manageMessages");
}

async function exec(ctx) {
    let locale = ctx.client.core.locale[ctx.gcfg.locale].com.admin.main;

    delete ctx.client.gcfg[ctx.guild.id];
    let options = ctx.content.split(" ");
    const command = options.slice(1, options.length)[0];
    ctx.content = options.slice(2).join(" ");
    if (subcommands.hasOwnProperty(command)) {
        return subcommands[command](ctx);
    } else {
        let disabled_list = ctx.gcfg.disabled ? ctx.gcfg.disabled[ctx.channel.id] : undefined;
        let prettylist = disabled_list ? disabled_list.map(item => `\`${item}\``).join(" ") : "";
        prettylist = prettylist.length > 0 ? ctx.client.sprintf(locale.disa, prettylist) : locale.nodisa;
        return ctx.send({
            "embed": {
                "description": [
                    ctx.client.sprintf(locale.cspcd, ctx.gcfg.climit),
                    ctx.client.sprintf(locale.mspcd, ctx.gcfg.mlimit),
                    ctx.client.sprintf(locale.cuspre, ctx.gcfg.prefix),
                    ctx.client.sprintf(locale.tricha, ctx.gcfg.trivia == 0 ? "none" : "<#" + ctx.gcfg.trivia + ">"),
                    prettylist
                ].join("\n")
            }
        });
    }
}

module.exports = {
    name: "admin",
    category: "admin",
    aliases: ["a"],
    ignoreCooldowns: true,
    checks,
    exec
};

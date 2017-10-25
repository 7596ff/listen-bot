const FuzzySet = require("fuzzyset.js")
const checkDiscordID = require("../util/checkDiscordID")

async function edit_trivia(pg, channel, ctx) {
    if (ctx.client.trivia.channels.includes(ctx.gcfg.trivia)) ctx.client.trivia.channels.splice(ctx.client.trivia.channels.indexOf(ctx.gcfg.trivia), 1);

    try {
        let res = await pg.query({
            "text": "UPDATE public.guilds SET trivia = $1 WHERE id = $2",
            "values": [channel, ctx.guild.id]
        });

        let msg = channel ? ctx.strings.get("admin_trivia_enable", channel) : ctx.strings.get("admin_trivia_disable");
        return ctx.success(msg);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

const subcommands = {
    botspam: async function(ctx) {
        if (ctx.content) {
            let channel = ctx.message.channelMentions.length ? ctx.message.channelMentions[0] : 0;

            try {
                let res = await ctx.client.pg.query({
                    "text": "UPDATE public.guilds SET botspam = $1 WHERE id = $2",
                    "values": [channel, ctx.guild.id]
                });

                channel = channel == 0 ? "`none`" : `<#${channel}>`;
                return ctx.success(ctx.strings.get("admin_botspam_change", channel));
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("bot_generic_error"));
            }
        } else {
            return ctx.failure(ctx.strings.get("bot_bad_syntax"));
        }
    },
    cooldowns: async function(ctx) {
        if (ctx.content) {
            let options = ctx.content.split(" ");
            if (["channel", "member"].indexOf(options[0]) != -1 && !isNaN(options[1])) {
                let limit = options[1];

                try {
                    let res = await ctx.client.pg.query({
                        "text": `UPDATE public.guilds SET ${options[0].charAt(0)}limit = $1 WHERE id = $2`,
                        "values": [limit, ctx.guild.id]
                    });

                    ctx.guild.members.forEach((member) => {
                        let cd = `mlimit:${ctx.guild.id}:${member.id}`;
                        if (ctx.client.cooldowns[cd]) ctx.client.cooldowns[cd] = 0;
                    });

                    ctx.guild.channels.forEach((channels) => {
                        let cd = `climit:${channels.id}`;
                        if (ctx.client.cooldowns[cd]) ctx.client.cooldowns[cd] = 0;
                    });

                    return ctx.success(ctx.strings.get("admin_cooldowns_set", options[0], options[1]))
                } catch (err) {
                    ctx.error(err);
                    return ctx.failure(ctx.strings.get("bot_generic_error"));
                }
            }  else {
                return ctx.failure(ctx.strings.get("bot_bad_syntax"));
            }
        }
    },
    disable: async function(ctx) {
        let allowed = [];

        for (let command in ctx.client.commands) {
            command = ctx.client.commands[command];
            if (["admin", "owner", "meta"].includes(command.category)) continue;

            allowed.push(command.name);
        }

        try {
            let res = await ctx.client.pg.query({
                "text": "SELECT * FROM guilds WHERE id = $1",
                "values": [ctx.guild.id]
            });

            let disabled = res.rows[0].disabled || {};
            let oldlist = disabled[ctx.channel.id] || [];

            let toDisable = ctx.options.filter((cmd) => allowed.includes(cmd));
            oldlist = oldlist.concat(toDisable);

            let newlist = oldlist.filter((item, index, array) => array.indexOf(item) === index);
            disabled[ctx.channel.id] = newlist;

            await ctx.client.pg.query({
                "text": "UPDATE public.guilds SET disabled = $1 WHERE id = $2",
                "values": [disabled, ctx.guild.id]
            });

            let prettylist = newlist.map(item => `\`${item}\``).join(" ");

            if (newlist.length) {
                return ctx.success(ctx.strings.get("admin_disable_list", prettylist));
            } else {
                return ctx.success(ctx.strings.get("admin_disable_none"));
            }
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    },
    enable: async function(ctx) {
        try {
            let res = await ctx.client.pg.query({
                "text": "SELECT * FROM guilds WHERE id = $1",
                "values": [ctx.guild.id]
            });

            let disabled = res.rows[0].disabled;
            let oldlist = disabled[ctx.channel.id];

            if (!disabled || !oldlist) {
                return ctx.failure(ctx.strings.get("admin_enable_error"));
            }

            for (let val of ctx.options) {
                if (oldlist.includes(val)) {
                    oldlist.splice(oldlist.indexOf(val), 1);
                }
            }

            await ctx.client.pg.query({
                "text": "UPDATE public.guilds SET disabled = $1 WHERE id = $2",
                "values": [disabled, ctx.guild.id]
            });

            let prettylist = oldlist.map(item => `\`${item}\``).join(" ");

            if (oldlist.length > 0) {
                return ctx.success(ctx.strings.get("admin_disable_list", prettylist));
            } else {
                return ctx.success(ctx.strings.get("admin_disable_none"));
            }
        } catch (err) {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    },
    locale: async function(ctx) {
        let available = Object.keys(ctx.client.locale);
        if (ctx.content) {
            if (available.includes(ctx.content)) {
                try {
                    let res = await ctx.client.pg.query({
                        "text": "UPDATE public.guilds SET locale = $1 WHERE id = $2",
                        "values": [ctx.content, ctx.guild.id]
                    });

                    return ctx.success(ctx.strings.get("admin_locale_change", ctx.content));
                } catch (err) {
                    ctx.error(err);
                    return ctx.failure(ctx.strings.get("bot_generic_error"));
                }
            } else {
                return ctx.failure(ctx.strings.get("admin_locale_failure", available.join(", ")));
            }
        } else {
            return ctx.failure(ctx.strings.get("admin_locale_failure", available.join(", ")));
        }
    },
    prefix: async function(ctx) {
        if (ctx.content) {
            try {
                let res = await ctx.client.pg.query({
                    "text": "UPDATE public.guilds SET prefix = $1 WHERE id = $2",
                    "values": [ctx.content, ctx.guild.id]
                });

                return ctx.success(ctx.strings.get("admin_prefix_change", ctx.content));
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("bot_generic_error"));
            }
        } else {
            return ctx.send("Invalid syntax.");
        }
    },
    trivia: async function(ctx) {
        if (ctx.message.channelMentions.length > 0) {
            return edit_trivia(ctx.client.pg, ctx.message.channelMentions[0], ctx);
        } else if (ctx.options.join(" ").trim() == "here") {
            return edit_trivia(ctx.client.pg, ctx.channel.id, ctx);
        } else if (ctx.options.join(" ").trim() == "none") {
            return edit_trivia(ctx.client.pg, 0, ctx);
        } else {
            return ctx.failure(ctx.strings.get("bot_bad_syntax"))
        }
    },
    threshold: async function(ctx) {
        let count = parseInt(ctx.options.join(" "));
        if (!isNaN(count) && count > 0 && count < 6) {
            try {
                let res = await ctx.client.pg.query({
                    text: "UPDATE public.guilds SET threshold = $1 WHERE id = $2;",
                    values: [count, ctx.guild.id]
                });
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("bot_generic_error"));
            }

            return ctx.success("Stack threshold updated.");
        } else {
            return ctx.failure("Please provide a threshold between 1 and 5.");
        }
    },
    subrole: async function(ctx) {
        let roles = FuzzySet(ctx.guild.roles.map((role) => role.name));
        let match = roles.get(ctx.options.join(" "));
        if (match && match[0][0] > 0.8) {
            try {
                let oldsubrole = await ctx.client.pg.query({
                    text: "SELECT subrole FROM guilds WHERE id = $1;",
                    values: [ctx.guild.id]
                });
                oldsubrole = oldsubrole.rows[0].subrole;

                if (oldsubrole) {
                    await ctx.client.pg.query({
                        text: "DELETE FROM subs WHERE owner = $1;",
                        values: [oldsubrole]
                    });
                }

                let role = ctx.guild.roles.find((role) => role.name == match[0][1]);

                await ctx.client.pg.query({
                    text: "UPDATE public.guilds SET subrole = $1 WHERE id = $2;",
                    values: [role.id, ctx.guild.id]
                });

                let ids = ctx.guild.members
                    .filter((member) => member.roles.includes(role.id))
                    .map((member) => member.id);

                let results = await Promise.all(ids.map((id) => checkDiscordID(ctx.client.pg, id)));
                results = results.filter((a) => a);
                results.unshift(1);

                await Promise.all(results.map((id) => ctx.client.pg.query({
                    text: "INSERT INTO subs VALUES ($1, $2, $3, $4)",
                    values: [role.id, ctx.channel.id, "player", id.toString()]
                })));

                ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                    action: "refresh"
                }));

                return ctx.embed({
                    description: `Subscription role set to ${role.name} (<@&${role.id}>) in channel ${ctx.channel.name} (<#${ctx.channel.id}>).`
                });
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("bot_generic_error"));
            }
        } else if (ctx.options[0] == "none") {
            try {
                let res = await ctx.client.pg.query({
                    text: "SELECT subrole FROM public.guilds WHERE id = $1;",
                    values: [ctx.guild.id]
                });

                if (!res.rows[0].subrole) {
                    return ctx.failure("There was no sub role to begin with!");
                }

                await ctx.client.pg.query({
                    text: "DELETE FROM subs WHERE owner = $1;",
                    values: [res.rows[0].subrole]
                });

                await ctx.client.pg.query({
                    text: "UPDATE public.guilds SET subrole = 0 WHERE id = $1;",
                    values: [ctx.guild.id]
                });

                ctx.client.redis.publish("listen:matches:new", JSON.stringify({
                    action: "refresh"
                }));

                return ctx.success("Subscription role removed.");
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("bot_generic_error"));
            }
        } else {
            return ctx.failure("Couldn't find a role.");
        }
    },
    announce: async function(ctx) {
        let roles = FuzzySet(ctx.guild.roles.map((role) => role.name));
        let match = roles.get(ctx.options.join(" "));
        if (match && match[0][0] > 0.8 && !(ctx.options[0] == "everyone" || ctx.options[0] == "@everyone")) {
            try {
                let role = ctx.guild.roles.find((role) => role.name == match[0][1]);

                await ctx.client.pg.query({
                    "text": "UPDATE guilds SET announce = $1 WHERE id = $2;",
                    "values": [role.id, ctx.guild.id]
                });

                return ctx.embed({
                    description: `Updated subscription announce role to ${role.mention}. Make sure this role is mentionable in it's settings!`
                });
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("bot_generic_error"));
            }
        } else if (ctx.options[0] == "everyone" || ctx.options[0] == "@everyone") {
            await ctx.client.pg.query({
                "text": "UPDATE guilds SET announce = $1 WHERE id = $1;",
                "values": [ctx.guild.id]
            });

            return ctx.success("Updated subscription announce role to @everyone.\nMake sure I have the permission to use *Mention Everyone* in this server or channel!");
        } else if (ctx.options[0] == "none") {
            try {
                await ctx.client.pg.query({
                    text: "UPDATE public.guilds SET announce = 0 WHERE id = $1;",
                    values: [ctx.guild.id]
                });

                return ctx.success("Subscription announce role removed.");
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("bot_generic_error"));
            }
        } else {
            console.log(ctx.options)
            return ctx.failure("Couldn't find a role.");
        }
    }
}

async function checks(client, member) {
    return member.permission.has("manageMessages");
}

async function exec(ctx) {
    delete ctx.client.gcfg[ctx.guild.id];
    const subcommand = ctx.options[0];
    if (subcommands.hasOwnProperty(subcommand)) {
        ctx.content = ctx.options.slice(1).join(" ");
        ctx.options = ctx.options.slice(1);
        return subcommands[subcommand](ctx);
    } else {
        let disabled_list = ctx.gcfg.disabled ? ctx.gcfg.disabled[ctx.channel.id] : undefined;
        let prettylist = disabled_list ? disabled_list.map(item => `\`${item}\``).join(" ") : "";
        prettylist = prettylist.length > 0 ? ctx.strings.get("admin_display_disabled_commands", prettylist) : ctx.strings.get("admin_display_disabled_commands_none");
        return ctx.send({
            "embed": {
                "description": [
                    ctx.strings.get("admin_display_channel_specific_cooldowns", ctx.gcfg.climit),
                    ctx.strings.get("admin_display_member_specific_cooldowns", ctx.gcfg.mlimit),
                    ctx.strings.get("admin_display_custom_prefix", ctx.gcfg.prefix),
                    ctx.strings.get("admin_display_trivia_channel", ctx.gcfg.trivia > 0 ? `<#${ctx.gcfg.trivia}>` : "none"),
                    ctx.strings.get("admin_display_botspam", (ctx.gcfg.botspam > 0 ? `<#${ctx.gcfg.botspam}>` : "none")),
                    ctx.strings.get("admin_display_subrole", (ctx.gcfg.subrole > 0 ? `<@&${ctx.gcfg.subrole}>` : "none")),
                    ctx.strings.get("admin_display_stack_threshold", ctx.gcfg.threshold),
                    ctx.strings.get("admin_display_locale", ctx.gcfg.locale),
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

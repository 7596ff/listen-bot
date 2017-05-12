const Eris = require("eris");
const redis = require("redis");
const pg = require("pg");
const config = require("./config.json");
var client = new Eris(config.token, config.options);
var sub = redis.createClient(config.redisconfig);
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const dbots_post = require("./dbots/post");
const statsTemplate = require("./templates/stats");
const shardinfoTemplate = require("./templates/shardinfo");
const Helper = require("./helper");
const Trivia = require("./classes/trivia");
const Usage = require("./classes/usage");
const Strings = require("./classes/strings");
const questions = require("./util/genQuestions");

const schedule = require("node-schedule");
const Mika = require("mika");

const types = ["player", "team", "league"];

const fs = require("fs");
const spawn = require("child_process").spawn;

client.commands = {};
client.watchers = {};
client.unwatchers = {};
client.gcfg = {};
client.cooldowns = {};
client.locale = {};
client.strings = {};
client.mika = new Mika();
client.redis = redis.createClient(config.redisconfig);
client.pg = new pg.Client(config.pgconfig);
client.config = config;
client.steam_connected = false;
client.isReady = false;

function load(obj, folder, flatten) {
    let length = 0;
    let files = fs.readdirSync(folder);
    for (file of files) {
        let full = `${folder}/${file}`;
        if (file.match(/\./)) {
            obj[file.split(".")[0]] = require(full);
            length += 1;
        } else {
            if (flatten) {
                length += load(obj, full);
            } else {
                obj[file] = {};
                length += load(obj[file], full);
            }
        }
    }
    return length;
}

let cmdsLoaded = load(client.commands, __dirname + "/commands", true);
console.log(`${new Date().toJSON()} BOT: loaded ${cmdsLoaded} commands`);

let localesLoaded = load(client.locale, __dirname + "/locale", true);
for (name in client.locale) {
    client.strings[name] = new Strings(client.locale[name]);
}
console.log(`${new Date().toJSON()} BOT: loaded ${localesLoaded} locales`);

client.helper = new Helper();
client.all_usage = new Usage(require("./usage.json"));
client.usage = new Usage();

client.write_usage_stats = schedule.scheduleJob("*/10 * * * *", () => {
    fs.writeFile("./usage.json", JSON.stringify(client.all_usage.stats), (err) => {
        if (err) client.helper.log("bot", err, "error");
    });
});

process.on("exit", (code) => {
    client.helper.log("bot", `Exiting with code ${code}`);
    fs.writeFileSync("./usage.json", JSON.stringify(client.all_usage.stats));
});

client.pg.on("error", (err) => {
    client.helper.log("bot", "idle pgclient error", err, "error");
});

client.on("ready", () => {
    client.helper.log("bot", "listen-bot ready.");
    client.isReady = true;

    client.redis.publish("discord", JSON.stringify({
        "code": 4,
        "message": "ping"
    }));

    client.helper.log("bot", "checking for new guilds...");
    client.pg.query("SELECT id FROM GUILDS;").then(res => {
        let pg_guilds = res.rows.map(row => row.id);
        client.guilds.forEach(guild => {
            if (!pg_guilds.includes(guild.id)) {
                client.helper.log("bot", "found new guild, inserting...");
                client.pg.query({
                    "text": "INSERT INTO public.guilds (id, name, prefix, climit, mlimit, locale, botspam) VALUES ($1, $2, $3, $4, $5, $6, $7);",
                    "values": [guild.id, guild.name, "--", 0, 0, "en", 0]
                }).then(() => {
                    client.helper.log("bot", "  inserted.");
                }).catch(err => {
                    client.helper.log("bot", "  something went wrong inserting unfound guild");
                    client.helper.log("bot", err, "error");
                });
            }
        });
    }).catch(err => {
        client.helper.log("bot", "something went wrong selecting id from guilds", "error");
        client.helper.log("bot", err, "error");
    });

    client.trivia = new Trivia(questions, questions.map(question => question.category).filter((item, index, array) => array.indexOf(item) === index));

    client.shards.forEach(shard => {
        shard.editStatus("online", {
            "name": `${config.default_prefix}info | ${config.default_prefix}help [${shard.id + 1}/${client.shards.size}]`
        });
    });

    client.stats_messages = schedule.scheduleJob("*/15 * * * *", () => {
        statsTemplate(client).then(embed => {
            client.editMessage(config.edit_channel, config.stats_edit_message, {
                "embed": embed
            }).catch(err => client.helper.log("bot", err, "error"));
        });
        
        client.editMessage(config.edit_channel, config.shard_edit_message, {
            "embed": {
                "description": shardinfoTemplate(client)
            }
        }).catch(err => client.helper.log("bot", err, "error"));

        if (config.dbots_token) dbots_post(client);
    });
});

client.on("guildCreate", guild => {
    client.redis.get(`${client.user.id}:blacklist:${guild.id}`, (err, reply) => {
        if (reply) {
            client.helper.log("bot", `${guild.id}/${guild.name}: joined blacklisted guild`);
            guild.leave().then(() => {
                client.helper.log("bot", "left guild");
            });
        } else {
            client.helper.log("bot", `${guild.id}/${guild.name}: joined guild on shard ${guild.shard.id}`);

            client.helper.log("bot", "  inserting into database");
            client.pg.query({
                "text": "INSERT INTO public.guilds (id, name, prefix, climit, mlimit, locale, botspam) VALUES ($1, $2, $3, $4, $5, $6, $7);",
                "values": [guild.id, guild.name, "--", 0, 0, "en", 0]
            }).then(() => {
                client.helper.log("bot", "  inserted");
            }).catch(err => {
                client.helper.log("bot", "  something went wrong inserting", "error");
                client.helper.log("bot", err, "error");
            });
        }
    });
});

client.on("guildUpdate", guild => {
    client.pg.query(`SELECT * FROM public.guilds WHERE id = '${guild.id}';`).then(res => {
        if (res.rows[0].name != guild.name) {
            client.helper.log("bot", `${guild.id}: guild updated, modifying name`);
            client.helper.log("bot", `  ${res.rows[0].name} -> ${guild.name}`);

            client.pg.query({
                "text": "UPDATE public.guilds SET name = $1 WHERE id = $2",
                "values": [guild.name, guild.id]
            }).then(() => {
                client.helper.log("bot", "  updated guild successfully");
            }).catch(err => {
                client.helper.log("bot", "  something went wrong updating", "error");
                client.helper.log("bot", err, "error");
            });
        }
    }).catch(err => {
        client.helper.log("bot", ` something went wrong selecting guild ${guild.id}/${guild.name}`, "error");
        client.helper.log("bot", err, "error");
    });
});

client.on("guildDelete", guild => {
    client.helper.log("bot", `${guild.id}/${guild.name}: left guild`);

    client.pg.query({
        "text": "DELETE FROM public.guilds WHERE id = $1",
        "values": [guild.id]
    }).then(() => {
        client.helper.log("bot", "  deleted guild successfully");
    }).catch(err => {
        client.helper.log("bot", "  something went wrong deleting", "error");
        client.helper.log("bot", err, "error");
    });
});

client.on("messageReactionAdd", (message, emoji, userID) => {
    if (userID == client.user.id) return;
    let watcher = client.watchers[message.id];
    if (watcher) watcher.handle(message, emoji, userID);
});

// async function publishMatches(data) {
//     console.log(data.found)
//     try {
//         let channels = [];
//         let res = await client.pg.query("SELECT * FROM subs;");

//         for (type of types) {
//             if (data.found[type].length) {
//                 let rows = res.rows.filter((row) => row.type == type && data.found[type].includes(Number(row.value)));
//                 for (row of rows) {
//                     let guild = client.channelGuildMap[row.channel];
//                     if (!guild) return;
//                     if (row.owner == guild) {
//                         if (data.found[type].length < 5) return;
//                         let sum = data.match.players
//                             .filter((player) => data.found[type].includes(player.account_id))
//                             .map((player) => player.player_slot)
//                             .reduce((a, b) => { return a + b });

//                         if (sum < 100 == match.radiant_win) {
//                             channels.push(row.channel);
//                         }
//                     } else {
//                         channels.push(row.channel);
//                     }
//                 }
//             }
//         }

//         if (!channels.length) return;

//         channels = channels.filter((item, index, array) => array.indexOf(item) === index);

//         let match = false;
//         let retries = 0;
//         while (!match || retries < 3) {
//             try {
//                 //match = await client.mika.getMatch(data.match.match_id);
//                 throw new Error();
//             } catch (err) {
//                 console.log("heck");
//                 retries += 1;
//             }
//         }

//         for (channel of channels) {
//             let key = `p${channel}${data.match.match_id}`;
//             let res = await client.redis.getAsync(key);
//             if (res) continue;

//             await client.redis.set(key, true);

//             //let embed = await client.core.embeds.match(client.core.json.od_heroes, match || data.match, client, client.guilds.get(client.channelGuildMap[channel]));
//             //await client.createMessage(channel, { embed }).catch((err) => console.error(err));
//         }

//         delete match;
//     } catch (err) {
//         console.error("err parsing/posting subscribed match");
//         console.error(err);
//     }
// }

sub.on("message", (channel, message) => {
    try {
        message = JSON.parse(message);
    } catch (err) {
        // heck;
    }

    if (channel == "steam") {
        if (!client.config.steam_enabled) return;
        client.helper.log("REDIS", message.message);

        switch(message.code) {
        case 0:
            client.steam_connected = true;
            break;
        case 1:
            client.steam_connected = false;
            break;
        case 3:
            client.users.get(message.discord_id).getDMChannel().then(dm_channel => {
                let dm = `All set! Dota ID ${message.dota_id} associated with Discord ID ${message.discord_id} (<@${message.discord_id}>).`;
                dm_channel.createMessage(dm);
                client.redis.expire(`register:${message.steam_id}`, 0);
            });
            break;
        case 4:
            client.steam_connected = true;
            break;
        }
    }

    if (channel == "__keyevent@0__:expired" && message.startsWith("trivia") && client.trivia) client.trivia.keyevent(message, client);

    //if (channel == "listen:matches:out") publishMatches(message);

    if (channel.includes("listen:rss")) {
        let feed = channel.split(":")[2];
        client.pg.query({
            "text": "SELECT channel FROM subs WHERE value = $1;",
            "values": [feed]
        }).catch((err) => console.error(err)).then((res) => {
            let msg = [
                `New feed post from ${message.author}: **${message.title}**`,
                `<${message.link}>`
            ].join("\n");
            res.rows.forEach((row) => {
                client.createMessage(row.channel, msg).catch((err) => console.error(err));
            });
        });
    }
});

async function invoke(message, client, helper, cmd) {
    if (cmd.checks) {
        let check = await cmd.checks(client, message.member);
        if (!check) {
            try {
                await message.channel.createMessage(client.strings[message.gcfg.locale].get("bot_no_permission"));
                return;
            } catch (err) {}
        }
    }

    if (cmd.triviaCheat && client.trivia.channels.includes(message.channel.id)) return;

    client.all_usage.increment(cmd.name);
    client.usage.increment(cmd.name);

    if (message.gcfg.climit > 0) {
        client.cooldowns[`climit:${message.channel.id}`] = message.timestamp;
        setTimeout(() => {
            client.cooldowns[`climit:${message.channel.id}`] = 0;
        }, message.gcfg.climit * 1000);
    }

    if (message.gcfg.mlimit > 0) {
        client.cooldowns[`mlimit:${message.author.id}`] = message.timestamp;
        setTimeout(() => {
            client.cooldowns[`mlimit:${message.author.id}`] = 0;
        }, message.gcfg.mlimit * 1000);
    }

    try {
        let ctx = {};

        ctx.message = message;
        ctx.client = client;
        ctx.helper = helper;

        ctx.content = message.content;
        ctx.options = ctx.content.split(" ").slice(1);

        ctx.channel = message.channel;
        ctx.member = message.member;
        ctx.author = message.author;
        ctx.guild = message.channel.guild;
        ctx.gcfg = message.gcfg;

        ctx.strings = client.strings[ctx.gcfg.locale || "en"];

        ctx.send = async function() {
            return this.message.channel.createMessage(...arguments);
        }.bind(ctx);

        ctx.embed = async function(embed) {
            return this.message.channel.createMessage({ embed })
        }.bind(ctx);

        ctx.success = async function(str) {
            return this.message.channel.createMessage(`✅ ${str}`);
        }.bind(ctx);

        ctx.failure = async function(str) {
            return this.message.channel.createMessage(`❌ ${str}`);
        }.bind(ctx);

        ctx.delete = async function() {
            let args = Array.from(arguments);
            return this.message.channel.createMessage(...args.slice(1)).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, args[0]);
            });
        }.bind(ctx);

        ctx.helper.log(message, `${cmd.name} (${ctx.options.join(" ")})`);
        if (cmd.typing) await message.channel.sendTyping();
        await cmd.exec(ctx);
    } catch (err) {
        console.error(err.response ? JSON.parse(err.response) : err);
        console.error(`content: ${message.content}`);
    }
}

function handle(message, client) {
    if (message.content.startsWith(message.gcfg.prefix) || message.content.startsWith(config.default_prefix)) {
        if (message.content.startsWith(config.default_prefix)) message.content = message.content.replace(config.default_prefix, "");
        if (message.content.startsWith(message.gcfg.prefix)) message.content = message.content.replace(message.gcfg.prefix, "");
        message.content = message.content.trim();

        let command = message.content.split(" ").shift().toLowerCase();

        for (let cmd in client.commands) {
            if (client.commands[cmd].aliases && client.commands[cmd].aliases.includes(command)) {
                command = client.commands[cmd].name;
            }
        }

        command = client.commands[command];
        if (!command) return;

        if (message.gcfg.botspam == message.channel.id || command.ignoreCooldowns) {
            invoke(message, client, client.helper, command);
            return;
        }

        let disabled_list = message.gcfg.disabled ? message.gcfg.disabled[message.channel.id] : undefined;
        if (disabled_list && disabled_list.includes(command)) {
            let content = client.strings[message.gcfg.locale || "en"].get("bot_botspam");

            if (message.gcfg.botspam) {
                content = client.strings[message.gcfg.locale || "en"].get("bot_botspam_redirect", message.gcfg.botspam);
            }

            message.channel.createMessage(content).catch((err) => client.helper.handle(message, err)).then((msg) => {
                setTimeout(function() {
                    if (msg) client.deleteMessage(msg.channel.id, msg.id);
                }, 10000);
            });

            return;
        };

        let climit = `climit:${message.channel.id}`;
        let mlimit = `mlimit:${message.author.id}`;

        if (client.cooldowns[climit] > 0) {
            if (client.cooldowns[climit] == 1) return;
            let timeleft = Math.floor((message.timestamp - client.cooldowns[climit]) / 1000);
            let msg = client.strings[message.gcfg.locale || "en"].get("bot_cooldown_redirect", message.channel.mention, message.gcfg.climit - timeleft);
            message.channel.createMessage(msg).then(new_message => {
                client.cooldowns[climit] = 1;
                setTimeout(() => { new_message.delete() }, 8000);
            }).catch((err) => client.helper.handle(message, err));
        } else {
            if (client.cooldowns[mlimit] > 0) {
                if (client.cooldowns[mlimit] == 1) return;
                let timeleft = Math.floor((message.timestamp - client.cooldowns[mlimit]) / 1000);
                let msg = client.strings[message.gcfg.locale || "en"].get("bot_cooldown_redirect", message.author.mention, message.gcfg.climit - timeleft);
                message.channel.createMessage(msg).then(new_message => {
                    client.cooldowns[mlimit] = 1;
                    setTimeout(() => { new_message.delete() }, 8000);
                }).catch((err) => client.helper.handle(message, err));
            } else {
                invoke(message, client, client.helper, command);
            }
        }
    } else {
        let triviaChecks = [
            client.trivia,
            client.trivia.channels.includes(message.channel.id),
            message.gcfg.trivia == message.channel.id
        ];
        if (triviaChecks.every((a) => a)) client.trivia.handle(message, client);

        let unwatcherChecks = [
            client.unwatchers.hasOwnProperty(`${message.channel.id}:${message.author.id}`),
            !isNaN(message.content)
        ];

        if (unwatcherChecks.every((a) => a)) client.unwatchers[`${message.channel.id}:${message.author.id}`].handle(message.content);
    }
}

client.on("messageCreate", async function(message) {
    if (!client.isReady) return;
    if (!message.channel.guild) return;
    if (message.member && message.member.bot) return;
    if (message.author && message.author.id == client.user.id) return;
    if (!message.author) return;

    try {
        let ban_status = await client.redis.getAsync(`listen:banned:${message.author.id}`);
        if (ban_status) return;
    } catch (err) {
        client.helper.log(message, `couldnt check if ${message.author.id}/${message.author.username} is banned`);
    }

    if (message.channel.guild.id == "137589613312081920" && message.content.match("<:ixmikeW:256896118380691466>")) message.content = `${config.default_prefix}mike`;
    if (message.channel.guild.id == "137589613312081920" && message.content.match("<:rtzW:302222677991620608>")) message.content = `${config.default_prefix}arteezy`;
    if (message.channel.guild.id == "137589613312081920" && message.content.match("<:jackyW:256527304576991243>")) message.content = `${config.default_prefix}envy`;

    if (client.gcfg.hasOwnProperty(message.channel.guild.id) && client.gcfg[message.channel.guild.id].expires + 3600000 > Date.now()) {
        message.gcfg = JSON.parse(JSON.stringify(client.gcfg[message.channel.guild.id]));
        handle(message, client);
    } else {
        client.pg.query({
            "text": "SELECT * FROM public.guilds WHERE id = $1;",
            "values": [message.channel.guild.id]
        }).then(res => {
            client.gcfg[message.channel.guild.id] = JSON.parse(JSON.stringify(res.rows[0]));
            client.gcfg[message.channel.guild.id].expires = Date.now();
            message.gcfg = JSON.parse(JSON.stringify(client.gcfg[message.channel.guild.id]));
            handle(message, client);
        }).catch(err => {
            client.helper.log("bot", `something went wrong with selcting ${message.channel.guild.id}/${message.channel.guild.name}`, "error");
            client.helper.log("bot", err, "error");
        });
    }
});

process.on("unhandledRejection", (reason, p) => {
    console.log(reason);
    console.log(p);
});

// connect to everything in order 
client.redis.on("ready", () => {
    client.helper.log("bot", "redis ready.");
    client.pg.connect((err) => {
        if (err) {
            client.helper.log("bot", "err conencting to client", "error");
            client.helper.log("bot", err, "error");
            process.exit(1);
        }

        client.helper.log("bot", "pg ready.");
        client.connect();
    });
});

sub.on("ready", () => {
    client.helper.log("bot", "redis sub ready.");
    sub.subscribe("steam");
    sub.subscribe("__keyevent@0__:expired");
    sub.subscribe("listen:matches:out");
    sub.subscribe("listen:rss:blog");
    sub.subscribe("listen:rss:steamnews");
    sub.subscribe("listen:rss:belvedere");
    sub.subscribe("listen:rss:cyborgmatt");
});

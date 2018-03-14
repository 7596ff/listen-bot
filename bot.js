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
const matchEmbed = require("./embeds/match");
const checkDiscordID = require("./util/checkDiscordID");
const Helper = require("./helper");
const Trivia = require("./classes/trivia");
const Usage = require("./classes/usage");
const Strings = require("./classes/strings");
const questions = require("./util/genQuestions");
const LeagueUtils = require("./classes/LeagueUtils");

const schedule = require("node-schedule");
const Mika = require("mika");
const prettyms = require("pretty-ms");

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
client.mika = new Mika(0.5); // requests at 2/s
client.leagues = new LeagueUtils(config.steam_key);
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
                    "text": "INSERT INTO public.guilds (id, name) VALUES ($1, $2);",
                    "values": [guild.id, guild.name]
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
            "name": `${config.default_prefix}info | ${config.default_prefix}help [${shard.id + 1}/${client.shards.size}]`,
            "type": 0
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
    client.helper.log("bot", `${guild.id}/${guild.name}: joined guild on shard ${guild.shard.id}`);

    client.helper.log("bot", "  inserting into database");
    client.pg.query({
            "text": "INSERT INTO public.guilds (id, name) VALUES ($1, $2);",
            "values": [guild.id, guild.name]
        }).then(() => {
        client.helper.log("bot", "  inserted");
    }).catch(err => {
        client.helper.log("bot", "  something went wrong inserting", "error");
        client.helper.log("bot", err, "error");
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

client.on("guildDelete", async function(guild) {
    client.helper.log("bot", `${guild.id}/${guild.name}: left guild`);

    try {
        await client.pg.query({
            text: "DELETE FROM public.guilds WHERE id = $1;",
            values: [guild.id]
        });

        await client.pg.query({
            text: "DELETE FROM public.subs WHERE owner = $1;",
            values: [guild.id]
        });

        client.redis.publish("listen:matches:new", JSON.stringify({
            action: "refresh"
        }));

        client.helper.log("bot", "  deleted guild successfully");
    } catch (err) {
        client.helper.log("bot", "  something went wrong deleting", "error");
        client.helper.log("bot", err, "error");
    }
});

client.on("messageReactionAdd", (message, emoji, userID) => {
    if (userID == client.user.id) return;
    let watcher = client.watchers[message.id];
    if (watcher) watcher.handle(message, emoji, userID);
});

client.on("guildMemberAdd", async function(guild, member) {
    try {
        let channel = await checkIfStacks(guild.id);
        if (!channel) return;

        let dota_id = await checkDiscordID(client.pg, member.id);
        if (!dota_id) return;

        let res = await client.pg.query({
            text: "INSERT INTO subs VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;",
            values: [guild.id, channel, "player", dota_id]
        });

        client.redis.publish("listen:matches:new", JSON.stringify({
            action: "refresh"
        }));

        console.log(`${new Date().toJSON()} BOT: added ${member.user.username} to ${guild.name} stacks (${res.rowCount})`);
    } catch (err) {
        console.error(err);
    }
});

client.on("guildMemberUpdate", async function(guild, member, oldMember) {
    try {
        let dota_id = await checkDiscordID(client.pg, member.id);
        if (!dota_id) return;

        let gcfg = await cacheGcfg(guild.id);
        if (!gcfg.subrole) return;

        let channel = await client.pg.query({
            text: "SELECT * FROM subs WHERE owner = $1 AND value = '1';",
            values: [gcfg.subrole]
        });
        if (!channel.rowCount) return;
        channel = channel.rows[0].channel;

        if (member.roles.includes(gcfg.subrole) && !oldMember.roles.includes(gcfg.subrole)) {
            await client.pg.query({
                text: "INSERT INTO subs VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;",
                values: [gcfg.subrole, channel, "player", dota_id]
            });

            client.redis.publish("listen:matches:new", JSON.stringify({
                action: "refresh"
            }));

            console.log(`${new Date().toJSON()} SUBS: added ${member.username} to ${guild.name} role stacks`);
        } else if (!member.roles.includes(gcfg.subrole) && oldMember.roles.includes(gcfg.subrole)) {
            let res = await client.pg.query({
                text: "DELETE FROM subs WHERE owner = $1 AND value = $2;",
                values: [gcfg.subrole, dota_id]
            });

            if (res.rowCount > 0) {
                client.redis.publish("listen:matches:new", JSON.stringify({
                    action: "refresh"
                }));

                console.log(`${new Date().toJSON()} SUBS: removed ${member.username} from ${guild.name} role stacks`);
            }
        }
    } catch (err) {
        console.error(err);
        console.error(`guild: ${guild.id}, member: ${member.id}`);
    }
});

client.on("guildMemberRemove", async function(guild, member) {
    try {
        let gcfg = await cacheGcfg(guild.id);

        let dota_id = await checkDiscordID(client.pg, member.id);
        if (!dota_id) return;

        let count = 0;

        let res = await client.pg.query({
            text: "DELETE FROM subs WHERE owner = $1 AND value = $2;",
            values: [guild.id, dota_id.toString()]
        });

        count += res.rowCount;

        if (gcfg.subrole) {
            let res = await client.pg.query({
                text: "DELETE FROM subs WHERE owner = $1 AND value = $2;",
                values: [gcfg.subrole, dota_id.toString()]
            });

            count += res.rowCount;
        }

        if (count) {
            client.redis.publish("listen:matches:new", JSON.stringify({
                action: "refresh"
            }));

            console.log(`${new Date().toJSON()} BOT: removed ${member.user.username} from ${guild.name} stacks`);
        }
    } catch (err) {
        console.error(err);
    }
});

client.on("guildRoleDelete", async function(guild, role) {
    let roleid = role.id;
    try {
        let res = await client.pg.query({
            text: "DELETE FROM subs WHERE owner = $1;",
            values: [roleid]
        });

        await client.pg.query({
            text: "UPDATE guilds SET subrole = 0 WHERE id = $1;",
            values: [guild.id]
        });

        if (res.rowCount > 0) {
            client.redis.publish("listen:matches:new", JSON.stringify({
                action: "refresh"
            }));

            console.log(`${new Date().toJSON()} SUBS: deleted rolesub on ${guild.id}/${guild.name} (${res.rowCount})`);
        }
    } catch (err) {
        console.error(err);
        console.error(`guild: ${guild.id}, role: ${role.id}`);
    }
});

async function cacheGcfg(id) {
    if (client.gcfg.hasOwnProperty(id) && client.gcfg[id].expires + 3600000 > Date.now()) {
        return JSON.parse(JSON.stringify(client.gcfg[id]));
    } else {
        try {
            let res = await client.pg.query({
                text: "SELECT * FROM public.guilds WHERE id = $1;",
                values: [id]
            });

            client.gcfg[id] = JSON.parse(JSON.stringify(res.rows[0]));
            client.gcfg[id].expires = Date.now();
            return JSON.parse(JSON.stringify(client.gcfg[id]));
        } catch (err) {
            console.error(err);
            console.error(`couldn't cache guild ${id}`);
        }
    }
}

function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function publishMatch(channel, match) {
    let guildID = client.channelGuildMap[channel];

    let res = await client.pg.query({
        text: "SELECT * FROM guilds WHERE id = $1;",
        values: [guildID]
    });

    let gcfg = res.rows[0];
    let strings = client.strings[gcfg.locale || "en"];

    let guild = client.guilds.get(guildID);

    let embed = await matchEmbed({
        client,
        strings,
        guild
    }, match);

    return client.createMessage(channel, {
        content: "New match found from scanner!",
        embed
    });
}

async function publishMatches(data) {
    if (!client.isReady) return;
    await sleep(5); // lol

    let match;
    try {
        match = await client.mika.getMatch(data.id);
    } catch (err) {
        console.error(err);
        return;
    }

    let res;
    try {
        res = await client.pg.query("SELECT * FROM subs;");
    } catch (err) {
        console.error(err);
        return;
    }

    let allRows = [];

    allRows.push(...res.rows.filter((row) => row.type == "player" && data.found.player.includes(parseInt(row.value))))
    allRows.push(...res.rows.filter((row) => row.type == "team" && data.found.team.includes(parseInt(row.value))))
    allRows.push(...res.rows.filter((row) => row.type == "league" && data.found.league.includes(parseInt(row.value))));

    let allChannels = allRows
        .filter((row) => !client.guilds.get(row.owner))
        .map((row) => row.channel);

    let allStacks = allRows.filter((row) => client.guilds.get(row.owner));

    let stacks = {};

    allStacks.forEach((row) => {
        if (!stacks[row.owner]) stacks[row.owner] = [];
        stacks[row.owner].push(parseInt(row.value));
    });

    for (guildID in stacks) {
        let players = stacks[guildID];
        let gcfg = await cacheGcfg(guildID);
        let idsInGuild = data.found.player.filter((id) => players.includes(parseInt(id)));

        if (idsInGuild.length >= (gcfg.threshold || 5)) {
            allChannels.push(allRows.find((row) => row.owner === guildID).channel);
        }
    }

    for (let playerID of data.found.player) {
        let key = `listen:nextmatch:${playerID}`;
        let length = await client.redis.llenAsync(key);

        if (!length) continue;

        for (let i = 0; i < length; i++) {
            let channel = await client.redis.lpopAsync(key);
            allChannels.push(channel);
        }

        client.redis.publish("listen:matches:new", JSON.stringify({
            action: "refresh"
        }));
    }

    allChannels = allChannels.filter((item, index, array) => array.indexOf(item) === index);

    let finished = [];

    for (channel of allChannels) {
        let key = `listen:posted:${channel}:${data.id}`;

        try {
            let posted = await client.redis.getAsync(key);
            if (posted) continue;

            await publishMatch(channel, JSON.parse(JSON.stringify(match)));
            await client.redis.setexAsync(key, 3600, true);
            finished.push(channel);
        } catch (err) {
            console.error(err.message || err);
            continue;
        }
    }

    finished.length && console.log(`${new Date().toJSON()} FEED: published ${data.id} to ${finished.length} channel(s)`);
    return;
}

async function checkIfStacks(guildID) {
    try {
        let res = await client.pg.query({
            text: "SELECT * FROM subs WHERE owner = $1 AND value = '1';",
            values: [guildID]
        });

        return res.rows.length ? res.rows[0].channel : false;
    } catch (err) {
        throw err;
    }
}

async function addUser(discord_id, dota_id) {
    let mutualIDs = client.guilds.filter((guild) => guild.members.get(discord_id) ? true : false).map((guild) => guild.id);

    try {
        let promises = mutualIDs.map((id) => checkIfStacks(id));
        let results = await Promise.all(promises);

        for (index in results) {
            if (results[index] !== false) {
                await client.pg.query({
                    text: "INSERT INTO subs VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;",
                    values: [mutualIDs[index], results[index], "player", dota_id]
                });
            }
        }

        if (results.find((a) => a)) {
            client.redis.publish("listen:matches:new", JSON.stringify({
                action: "refresh"
            }));
        }
    } catch (err) {
        console.error(err);
    }
}

async function publishFeed(channel, message) {
    let feed = channel.split(":")[2];
    let res, content;

    try {
        res = await client.pg.query({
            "text": "SELECT channel FROM subs WHERE value = $1;",
            "values": [feed]
        });

        content = `New feed post from ${message.author}: **${message.title}**\n<${message.link}>`;
    } catch (err) {
        console.error(err);
    }

    for (let row of res.rows) {
        try {
            let msg = { content: content.slice() };

            let guild = client.channelGuildMap[row.channel]
            if (guild) {
                let config = await cacheGcfg(guild);

                if (config.announce === guild) {
                    msg.disableEveryone = false;
                    msg.content = `@everyone ${msg.content}`
                } else if (config.announce && config.announce !== "0") {
                    msg.content = `<@&${config.announce}> ${msg.content}`;
                }
            }

            await client.createMessage(row.channel, msg);
        } catch (err) {
            if (err.code == 10003 || err.code == 50001) { // channel is deleted or bot left server
                client.pg.query({
                    "text": "DELETE FROM subs WHERE channel = $1 RETURNING channel;",
                    "values": [row.channel]
                }).then((res) => {
                    console.log(`deleted channel ${res.rows[0].channel}`);
                });
            } else if (err.code == 50013) {
                console.error(`no permission for channel ${row.channel}`);
            } else {
                console.error(row.channel);
                console.error(err);
            }
        }
    }
}

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
                addUser(message.discord_id, message.dota_id);
            });
            break;
        case 4:
            client.steam_connected = true;
            break;
        }
    }

    if (channel == "__keyevent@0__:expired" && message.startsWith("trivia") && client.trivia) client.trivia.keyevent(message, client);

    if (channel == "listen:matches:out") publishMatches(message);

    if (channel.includes("listen:rss")) publishFeed(channel, message);
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

    client.cooldowns[`climit:${message.channel.id}`] = message.timestamp;
    client.cooldowns[`mlimit:${message.channel.guild.id}:${message.author.id}`] = message.timestamp;

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

        ctx.name = cmd.name;

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

        ctx.error = async function(err) {
            console.error(err);
            this.helper.print(`error in command ${this.name}`, "error");
        }.bind(ctx);

        ctx.helper.log(message, `${cmd.name} (${ctx.options.join(" ")})`);
        if (cmd.typing) await message.channel.sendTyping();
        await cmd.exec(ctx);
    } catch (err) {
        console.error(err.response || err.message || err);
        console.error(`content: ${message.content}`);
    }
}

function checkDisabed(gcfg, channel, command) {
    if (!gcfg.disabled) return false;
    if (!gcfg.disabled[channel]) return false;
    if (!gcfg.disabled[channel].includes(command)) return false;

    return true;
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

        if (checkDisabed(message.gcfg, message.channel.id, command.name)) {
            if (message.gcfg.botspam > 0) {
                return message.channel.createMessage(client.strings[message.gcfg.locale || "en"].get("bot_botspam_redirect", message.gcfg.botspam))
                    .catch((err) => console.error("couldn't send botspam redirect"));
            } else {
                return message.channel.createMessage(client.strings[message.gcfg.locale || "en"].get("bot_botspam", message.gcfg.botspam))
                    .catch((err) => console.error("couldn't send botspam redirect"));
            }
        }

        let climit = `climit:${message.channel.id}`;
        let mlimit = `mlimit:${message.channel.guild.id}:${message.author.id}`;

        if (message.gcfg.climit && (client.cooldowns[climit] || 0) + (message.gcfg.climit * 1000) > message.timestamp) {
            let msg = client.strings[message.gcfg.locale || "en"].get("bot_cooldown_redirect", message.channel.mention, prettyms((message.gcfg.climit * 1000) - (message.timestamp - client.cooldowns[climit])));
            message.channel.createMessage(msg).then(new_message => {
                setTimeout(() => { new_message.delete() }, 8000);
            }).catch((err) => client.helper.handle(message, err));
        } else {
            if (message.gcfg.mlimit && (client.cooldowns[mlimit] || 0) + (message.gcfg.mlimit * 1000) > message.timestamp) {
                let msg = client.strings[message.gcfg.locale || "en"].get("bot_cooldown_redirect", message.author.mention, prettyms((message.gcfg.mlimit * 1000) - (message.timestamp - client.cooldowns[mlimit])));
                message.channel.createMessage(msg).then(new_message => {
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

    if (message.channel.guild.id == "137589613312081920" && message.content.match("<:ixmikeW:256896118380691466>")) message.content = `${config.default_prefix}mike`;
    if (message.channel.guild.id == "137589613312081920" && message.content.match("<:rtzW:302222677991620608>")) message.content = `${config.default_prefix}arteezy`;
    if (message.channel.guild.id == "137589613312081920" && message.content.match("<:jackyW:256527304576991243>")) message.content = `${config.default_prefix}envy`;

    message.gcfg = await cacheGcfg(message.channel.guild.id);
    handle(message, client);
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
    sub.subscribe("listen:rss:wykrhm");
});

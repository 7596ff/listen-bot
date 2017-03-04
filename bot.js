const Eris = require("eris");
const redis = require("redis");
const pg = require("pg");
const config = require("./json/config.json");
var client = new Eris(config.token, config.options);
var sub = redis.createClient(config.redisconfig);

const consts = require("./util/consts.json");
const stats_helper = require("./util/stats_helper");
const shardinfo_helper = require("./util/shardinfo_helper");
const dbots_post = require("./dbots/post");
const Helper = require("./util/helper");

const schedule = require("node-schedule");
const Mika = require("mika");

const util = require("util");
const fs = require("fs");

client.commands = {};
client.watching = {};
client.gcfg = {};
client.all_usage = require("./json/usage.json");
client.usage = { "all": 0 };
client.mika = new Mika();
client.redis = redis.createClient(config.redisconfig);
client.pg = new pg.Client(config.pgconfig);
client.config = config;
client.steam_connected = false;

for (let cmd in consts.cmds) {
    client.commands[cmd] = require(`./commands/${cmd}`);
    client.usage[cmd] = 0;
    client.all_usage[cmd] = isNaN(client.all_usage[cmd]) ? 0 : client.all_usage[cmd];
}

client.helper = new Helper();

client.write_usage_stats = schedule.scheduleJob("*/10 * * * *", () => {
    fs.writeFile("./json/usage.json", JSON.stringify(client.all_usage), (err) => {
        if (err) util.log(err);
    });
});

process.on("exit", (code) => {
    util.log(`Exiting with code ${code}`);
    fs.writeFileSync("./json/usage.json", JSON.stringify(client.all_usage));
});

client.pg.on("error", (err) => {
    util.log("idle pgclient error", err.message, err.stack);
});

client.on("ready", () => {
    util.log("listen-bot ready.");

    client.redis.publish("discord", JSON.stringify({
        "code": 4,
        "message": "ping"
    }));

    util.log("checking for new guilds...");
    client.pg.query("SELECT id FROM GUILDS;").then(res => {
        let pg_guilds = res.rows.map(row => row.id);
        client.guilds.forEach(guild => {
            if (!pg_guilds.includes(guild.id)) {
                util.log("found new guild, inserting...");
                client.pg.query({
                    "text": "INSERT INTO public.guilds (id, name, prefix, climit, mlimit) VALUES ($1, $2, $3, $4, $5);",
                    "values": [guild.id, guild.name, "--", 0, 0]
                }).then(() => {
                    util.log("  inserted.");
                }).catch(err => {
                    util.log("  something went wrong inserting unfound guild");
                    util.log(err);
                });
            }
        });
    }).catch(err => {
        util.log("something went wrong selecting id from guilds.");
        util.log(err);
    });

    client.shards.forEach(shard => {
        shard.editStatus("online", {
            "name": `${config.default_prefix}info | ${config.default_prefix}help [${shard.id + 1}/${client.shards.size}]`
        });
    });

    client.stats_messages = schedule.scheduleJob("*/15 * * * *", () => {
        stats_helper(client).then(embed => {
            client.editMessage(config.edit_channel, config.stats_edit_message, {
                "embed": embed
            }).catch(err => util.log(err));
        });
        
        client.editMessage(config.edit_channel, config.shard_edit_message, {
            "embed": {
                "description": shardinfo_helper(client)
            }
        }).catch(err => util.log(err));

        if (config.dbots_token) dbots_post(client);
    });
});

client.on("messageReactionAdd", (message, emoji, userID) => {
    if (userID == client.user.id) return;
    if (!message.author) return;
    if (message.author.id != client.user.id) return;

    client.redis.get(`${message.id}:author_id`, (err, author_id) => {
        if (err) {
            util.log("something went wrong getting from redis");
            util.log("err");
            return;
        }

        if (!author_id) return;

        client.redis.get(`${message.id}:${emoji.name}`, (err, reply) => {
            if (!err && reply && JSON.parse(author_id) == userID) {
                let has_perms = client.guilds.get(client.channelGuildMap[message.channel.id]).members.get(client.user.id).permission.has("manageMessages");
                client.editMessage(message.channel.id, message.id, {
                    "content": has_perms ? "" : (message.content || ""),
                    "embed": JSON.parse(reply)
                }).catch(err => util.log(err));

                if (has_perms) {
                    setTimeout(() => {
                        client.removeMessageReaction(message.channel.id, message.id, emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name, JSON.parse(author_id));
                    }, 250);
                }
            } else if (err) {
                util.log("something went wrong getting from redis");
                util.log(err);
            }
        });
    });
});

client.on("guildCreate", guild => {
    util.log(`${guild.id}/${guild.name}: joined guild on shard ${guild.shard.id}`);

    util.log("  inserting into database");
    client.pg.query({
        "text": "INSERT INTO public.guilds (id, name, prefix, climit, mlimit) VALUES ($1, $2, $3, $4, $5);",
        "values": [guild.id, guild.name, "--", 0, 0]
    }).then(() => {
        util.log("  inserted");
    }).catch(err => {
        util.log("  something went wrong inserting");
        util.log(err);
    });
});

client.on("guildUpdate", guild => {
    client.pg.query(`SELECT * FROM public.guilds WHERE id = '${guild.id}';`).then(res => {
        if (res.rows[0].name != guild.name) {
            util.log(`${guild.id}: guild updated, modifying name`);
            util.log(`  ${res.rows[0].name} -> ${guild.name}`);

            client.pg.query({
                "text": "UPDATE public.guilds SET name = $1 WHERE id = $2",
                "values": [guild.name, guild.id]
            }).then(() => {
                util.log("  updated guild successfully");
            }).catch(err => {
                util.log("  something went wrong updating");
                util.log(err);
            });
        }
    }).catch(err => {
        util.log(` something went wrong selecting guild ${guild.id}/${guild.name}`);
        util.log(err);
    });
});

client.on("guildDelete", guild => {
    util.log(`${guild.id}/${guild.name}: left guild`);

    client.pg.query({
        "text": "DELETE FROM public.guilds WHERE id = $1",
        "values": [guild.id]
    }).then(() => {
        util.log("  deleted guild successfully");
    }).catch(err => {
        util.log("  something went wrong deleting");
        util.log(err);
    });
});

sub.on("message", (channel, message) => {
    if (!client.config.steam_enabled) return;
    if (channel == "steam") {
        message = JSON.parse(message);
        util.log(`REDIS: ${message.message}`);

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
});

function invoke(message, client, helper, command) {
    client.commands[command](message, client, helper);
    client.usage["all"] += 1;
    client.usage[command] += 1;
    client.all_usage["all"] += 1;
    client.all_usage[command] += 1;

    client.redis.set(`climit:${message.channel.id}`, "1");
    client.redis.set(`mlimit:${message.author.id}`, "1");

    client.redis.expire(`climit:${message.channel.id}`, message.gcfg.climit);
    client.redis.expire(`mlimit:${message.author.id}`, message.gcfg.mlimit);
}

function handle(message, client) {
    if (message.content.startsWith(message.gcfg.prefix) || message.content.startsWith(config.default_prefix)) {
        if (message.content.startsWith(config.default_prefix)) message.content = message.content.replace(config.default_prefix, "");
        if (message.content.startsWith(message.gcfg.prefix)) message.content = message.content.replace(message.gcfg.prefix, "");
        message.content = message.content.trim();

        let command = message.content.split(" ").shift().toLowerCase();

        for (let cmd in consts.cmds) if (consts.cmds[cmd].includes(command)) command = cmd;

        let disabled_list = message.gcfg.disabled ? message.gcfg.disabled[message.channel.id] : undefined;
        if (disabled_list && disabled_list.includes(command)) return;

        let climit = `climit:${message.channel.id}`;
        let mlimit = `mlimit:${message.author.id}`;

        if (command in client.commands) {
            client.redis.get(climit, (err, reply) => {
                if (reply) {
                    if (reply != "1") return;
                    client.redis.ttl(climit, (err, reply) => {
                        message.channel.createMessage(`${message.channel.mention}, please cool down! ${reply} seconds left.`).then(new_message => {
                            setTimeout(() => { new_message.delete(); }, reply * 1000);
                        }).catch(err => client.helper.handle(message, err));
                        client.redis.set(climit, "2");
                        client.redis.expire(climit, reply);
                    });
                } else {
                    client.redis.get(mlimit, (err, reply) => {
                        if (reply) {
                            if (reply != "1") return;
                            client.redis.ttl(mlimit, (err, reply) => {
                                message.channel.createMessage(`${message.author.mention}, please cool down! ${reply} seconds left.`).then(new_message => {
                                    setTimeout(() => { new_message.delete(); }, reply * 1000);
                                }).catch(err => client.helper.handle(message, err));
                                client.redis.set(mlimit, "2");
                                client.redis.expire(mlimit, reply);
                            });
                        } else {
                            invoke(message, client, client.helper, command);
                        }
                    });
                }
            });
        }
    }
}

client.on("messageCreate", message => {
    if (!message.channel.guild) return;
    if (message.member && message.member.bot) return;
    if (message.author && message.author.id == client.user.id) return;

    if (!message.author) {
        util.log("no author");
        util.log(`${message.channel.guild.id}/${message.channel.guild.name}`);
        util.log(`${message.content}`);
        return;
    }

    if (client.gcfg.hasOwnProperty(message.channel.guild.id)) {
        message.gcfg = JSON.parse(JSON.stringify(client.gcfg[message.channel.guild.id]));
        handle(message, client);
    } else {
        client.pg.query({
            "text": "SELECT * FROM public.guilds WHERE id = $1;",
            "values": [message.channel.guild.id]
        }).then(res => {
            client.gcfg[message.channel.guild.id] = JSON.parse(JSON.stringify(res.rows[0]));
            message.gcfg = JSON.parse(JSON.stringify(client.gcfg[message.channel.guild.id]));
            handle(message, client);
        }).catch(err => {
            util.log(`something went wrong with selcting ${message.channel.guild.id}/${message.channel.guild.name}`);
            util.log(err);
        });
    }
});

// connect to everything in order 
client.redis.on("ready", () => {
    util.log("redis ready.");
    client.pg.connect((err) => {
        if (err) {
            util.log("err conencting to client");
            util.log(err);
            process.exit(1);
        }

        util.log("pg ready.");
        client.connect();
    });
});

sub.on("ready", () => {
    util.log("redis sub ready.");
    sub.subscribe("steam");
});

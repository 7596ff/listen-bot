const Eris = require("eris");
const Steam = require("steam");
const redis = require("redis");
const pg = require("pg");
const config = require("./json/config.json");
var client = new Eris(config.token, config.options);
client.steam_client = new Steam.SteamClient();
client.steam_user = new Steam.SteamUser(client.steam_client);
client.steam_friends = new Steam.SteamFriends(client.steam_client);

const consts = require("./util/consts.json");
const stats_helper = require("./util/stats_helper");
const shardinfo_helper = require("./util/shardinfo_helper");
const dbots_post = require("./dbots/post");

const schedule = require("node-schedule");
const Mika = require("mika");
const bignumber = require("bignumber.js");

const util = require("util");
const fs = require("fs");

client.commands = {};
client.all_usage = require("./json/usage.json");
client.usage = { "all": 0 };
client.mika = new Mika();
client.redis = redis.createClient();
client.pg = new pg.Client(config.pgconfig);
client.config = config;

for (let cmd in consts.cmds) {
    client.commands[cmd] = require(`./commands/${cmd}`);
    client.usage[cmd] = 0;
    client.all_usage[cmd] = isNaN(client.all_usage[cmd]) ? 0 : client.all_usage[cmd];
}

client.helper = {
    log: (message, text) => {
        if (this.last_guild == message.channel.guild.name) {
            if (this.last_channel == message.channel.name) {
                util.log(`  ${text.toString().trim()}`);
            } else {
                util.log(`${message.channel.name}: ${text.toString().trim()}`);
            }
        } else {
            util.log(`${message.channel.guild.name}/${message.channel.name}: ${text.toString().trim()}`);
        }

        this.last_guild = message.channel.guild.name;
        this.last_channel = message.channel.name;
    },

    handle: (message, err) => {
        let result = err.toString().split(" ")[1];
        if (result == "400") {
            util.log("probably don't have permissions to embed here");
        } else if (result == "403") {
            util.log("probably don't have permissions to send messages here");
        } else {
            util.log(err.toString());
        }
    }
};

function steam_cleanup(client, dota_id, steam_id, discord_id) {
    client.steam_friends.removeFriend(steam_id);
    client.users.get(discord_id).getDMChannel().then(dm_channel => {
        dm_channel.createMessage(`All set! Dota ID ${dota_id} associated with Discord ID ${discord_id} (<@${discord_id}>).`);
    });
    client.redis.expire(`register:${steam_id}`, 0);
}

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

client.on("messageCreate", message => {
    if (!message.channel.guild) return;
    if (message.member && message.member.bot) return;
    if (message.author.id == client.user.id) return;

    if (!message.author) {
        util.log("no author");
        util.log(`${message.channel.guild.id}/${message.channel.guild.name}`);
        util.log(`${message.content}`);
        return;
    }

    client.pg.query({
        "text": "SELECT * FROM public.guilds WHERE id = $1;",
        "values": [message.channel.guild.id]
    }).then(res => {
        message.gcfg = res.rows[0];
        let _helper = client.helper;

        if (message.content.startsWith(message.gcfg.prefix) || message.content.startsWith(config.default_prefix)) {
            if (message.content.startsWith(config.default_prefix)) message.content = message.content.replace(config.default_prefix, "");
            if (message.content.startsWith(message.gcfg.prefix)) message.content = message.content.replace(message.gcfg.prefix, "");
            message.content = message.content.trim();

            let command = message.content.split(" ").shift();

            for (let cmd in consts.cmds) {
                if (consts.cmds[cmd].indexOf(command) != -1) {
                    command = consts.cmds[cmd][0];
                }
            }

            let disabled_list = message.gcfg.disabled ? message.gcfg.disabled[message.channel.id] : undefined;
            if (disabled_list && disabled_list.indexOf(command) != -1) return;

            let climit = `climit:${message.channel.id}`;
            let mlimit = `mlimit:${message.author.id}`;

            if (command in client.commands) {
                client.redis.get(climit, (err, reply) => {
                    if (reply) {
                        if (reply == "1") {
                            client.redis.ttl(climit, (err, reply) => {
                                let channel_str = `<#${message.channel.id}>`;
                                message.channel.createMessage(`${channel_str}, please cool down! ${reply} seconds left.`).then(new_message => {
                                    setTimeout(() => { new_message.delete() }, reply * 1000);
                                });
                                client.redis.set(climit, "2");
                                client.redis.expire(climit, reply);
                            });
                        }
                    } else {
                        client.redis.get(mlimit, (err, reply) => {
                            if (reply) {
                                if (reply == "1") { 
                                    client.redis.ttl(mlimit, (err, reply) => {
                                        let member_str = `<@${message.author.id}>`;
                                        message.channel.createMessage(`${member_str}, please cool down! ${reply} seconds left.`).then(new_message => {
                                            setTimeout(() => { new_message.delete() }, reply * 1000);
                                        });
                                        client.redis.set(mlimit, "2");
                                        client.redis.expire(mlimit, reply);
                                    });
                                }
                            } else {
                                invoke(message, client, _helper, command);
                            }
                        });
                    }
                });
            }
        }
    }).catch(err => {
        util.log(`something went wrong with selcting ${message.channel.guild.id}/${message.channel.guild.name}`);
        util.log(err);
    });
});

client.steam_client.on("connected", () => {
    util.log("connected to steam.");
    util.log("logging on to steam...");
    client.steam_user.logOn(config.steam_config);
});

client.steam_client.on("logOnResponse", () => {
    client.steam_friends.setPersonaState(Steam.EPersonaState.Online);
});

client.steam_client.once("logOnResponse", () => {
    util.log("logged on to steam.");
    util.log("connecting to discord...");
    client.connect();
});

client.steam_friends.on("friend", (id, relationship) => {
    if (relationship == 3) {
        client.steam_friends.sendMessage(id, "Please send me the code you recieved on Discord!");
    }
});

client.steam_friends.on("friendMsg", (steam_id, message) => {
    let q = `register:${steam_id}`;
    client.redis.get(q, (err, reply) => {
        if (err) util.log(err);
        if (!reply) return;
        reply = reply.split(":");
        let code = reply[0];
        let discord_id = reply[1];
        if (code == message.trim()) {
            let dota_id = new bignumber(steam_id).minus("76561197960265728");

            client.pg.query({
                "text": "SELECT * FROM public.users WHERE id = $1;",
                "values": [discord_id]
            }).then(res => {
                if (res.rowCount == 0) {
                    client.pg.query({
                        "text": "INSERT INTO public.users (id, steamid, dotaid) VALUES ($1, $2, $3);",
                        "values": [discord_id, parseInt(steam_id), parseInt(dota_id)]
                    }).then(() => {
                        util.log(`  inserted dota id ${dota_id}`);
                        steam_cleanup(client, dota_id, steam_id, discord_id);
                    }).catch(err => {
                        util.log("  something went wrong inserting a user");
                        util.log(err);
                    });
                } else {
                    client.pg.query({
                        "text": "UPDATE public.users SET id = $1, steamid = $2, dotaid = $3 WHERE id = $1;",
                        "values": [discord_id, parseInt(steam_id), parseInt(dota_id)]
                    }).then(() => {
                        util.log(`  updated dota id ${res.rows[0].dotaid} -> ${dota_id}`);
                        steam_cleanup(client, dota_id, steam_id, discord_id);
                    }).catch(err => {
                        util.log("  something went wrong updating a user");
                        util.log(err);
                    });
                }
            }).catch(err => {
                util.log("  something went wrong selecting a user");
                util.log(err);
            });
        }
    });
});

// connect to everthing in order
client.redis.on("ready", () => {
    util.log("redis ready.");
    util.log("connecting to pg...");
    client.pg.connect((err) => {
        if (err) {
            util.log("err conencting to client");
            util.log(err);
            process.exit(1);
        }

        util.log("pg ready.");
        if (config.steam_enabled) {
            util.log("conncting to steam...");
            client.steam_client.connect();
        } else {
            util.log("conncting to discord...");
            client.connect();
        }
    });
});

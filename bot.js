const Eris = require("eris");
const redis = require("redis");
const pg = require("pg");
const config = require("./json/config.json");
var client = new Eris(config.token, config.options);

const schedule = require("node-schedule");
const Mika = require("mika");

const util = require("util");
const fs = require("fs");

var _members = {};
var _channels = {};

client.commands = {};
client.all_usage = require("./json/usage.json");
client.usage = { "all": 0 };
client.mika = new Mika();
client.redis = redis.createClient();
client.pg = new pg.Client(config.pgconfig);
client.config = config;

for (let cmd of require("./util/consts.json").cmdlist) {
    client.commands[cmd] = require(`./commands/${cmd}`);
    client.usage[cmd] = 0;
    client.all_usage[cmd] = isNaN(client.all_usage[cmd]) ? 0 : client.all_usage[cmd];
}

function Helper(prefix) {
    this.prefix = prefix;

    this.log = (message, text) => {
        require("util").log(`${message.channel.guild.name}/${message.channel.name}: ${text}`);
    };

    this.handle = (message, err) => {
        let result = err.toString().split(" ")[1];
        if (result == "400") {
            this.log(message, "probably don't have permissions to embed here");
        } else if (result == "403") {
            this.log(message, "probably don't have permissions to send messages here");
        } else {
            this.log(message, err.toString());
        }
    };
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

client.pg.on("error", (err, pgclient) => {
    util.log("idle pgclient error", err.message, err.stack);
});

client.on("ready", () => {
    util.log("listen-bot ready.");

    client.shards.forEach(shard => {
        shard.editStatus("online", {
            "name": `${config.default_prefix}info | ${config.default_prefix}help [${shard.id + 1}/${client.shards.size}]`
        });
    });

    client.stats_messages = schedule.scheduleJob("*/15 * * * *", () => {
        client.editMessage(config.edit_channel, config.shard_edit_message, {
            "embed": {
                "description": require("./util/shardinfo_helper")(client)
            }
        }).catch(err => util.log(err));
        client.editMessage(config.edit_channel, config.stats_edit_message, {
            "embed": require("./util/stats_helper")(client)
        }).catch(err => util.log(err));
        if (config.dbots_token) {
            require("needle").post(
                `https://bots.discord.pw/api/bots/${config.master_id}/stats`,
                JSON.stringify({
                    "server_count": client.guilds.size
                }), {
                    "headers": {
                        "Authorization": config.dbots_token,
                        "Content-Type": "application/json"
                    }
                },
                (err, resp) => {
                    if (err) {
                        util.log(err);
                        return;
                    } else if (resp.statusCode != 200) {
                        util.log(resp.statusCode);
                    }
                }
            );
        }
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
            util.log(`${guild.id}/${guild.name}: guild updated, modifying name`);

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
        let _helper = new Helper(message.gcfg.prefix);

        if (message.content.startsWith(message.gcfg.prefix) || message.content.startsWith(config.default_prefix)) {
            if (message.content.startsWith(message.gcfg.prefix)) message.content = message.content.replace(message.gcfg.prefix, "");
            if (message.content.startsWith(config.default_prefix)) message.content = message.content.replace(config.default_prefix, "");
            message.content = message.content.trim();

            const command = message.content.split(" ").shift();
            if (command in client.commands) {
                if (!_members[message.member.id] || _members[message.member.id].last_message + message.gcfg.mlimit < Date.now()) {
                    if (!_channels[message.channel.id] || _channels[message.channel.id].last_message + message.gcfg.climit < Date.now()) {
                        let rate = {
                            "last_message": Date.now(),
                            "cooldown_sent": false
                        };

                        _members[message.member.id] = JSON.parse(JSON.stringify(rate));
                        _channels[message.channel.id] = JSON.parse(JSON.stringify(rate));
                        client.commands[command](message, client, _helper);
                        client.usage["all"] += 1;
                        client.usage[command] += 1;
                        client.all_usage["all"] += 1;
                        client.all_usage[command] += 1;
                    } else {
                        if (!_channels[message.channel.id].cooldown_sent) {
                            let timeleft = Math.ceil((_channels[message.channel.id].last_message + message.gcfg.climit - Date.now()) / 1000);
                            message.channel.createMessage(`\`#${message.channel.name}\` Please cool down! ${timeleft} second(s) left.`).then(new_message => {
                                setTimeout(() => { new_message.delete(); }, 4000);
                                _helper.log(message, "channel ratelimited");
                                _channels[message.channel.id].cooldown_sent = true;
                            }).catch(err => _helper.handle(err));
                        }
                    }
                } else {
                    if (!_members[message.member.id].cooldown_sent) {
                        let timeleft = Math.ceil((_members[message.member.id].last_message + message.gcfg.mlimit - Date.now()) / 1000);
                        message.channel.createmessage(`<@!${message.member.id}>, Please cool down! ${timeleft} second(s) left.`).then(new_message => {
                            setTimeout(() => { new_message.delete(); }, 4000);
                            _helper.log(message, "member ratelimited");
                            _members[message.member.id].cooldown_sent = true;
                        }).catch(err => _helper.handle(err));
                    }
                }
            } else {
                _helper.log(message, "malformed command used");
                _helper.log(message, message.content);
            }
        }
    }).catch(err => {
        util.log(`something went wrong with selcting ${message.channel.guild.id}/${message.channel.guild.name}`);
        util.log(err);
    });
});

// connect to everthing in order
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

const Eris = require("eris");
const redis = require("redis");
const pg = require("pg");
const config = require("./json/config.json");
var client = new Eris(config.token, config.options);

const schedule = require("node-schedule");
const Mika = require("mika");

const util = require("util");
const fs = require("fs");

var stats_messages;

var guilds_list = require("./json/guilds.json");
var _members = {};
var _channels = {};

client.commands = {};
client.all_usage = require("./json/usage.json");
client.usage = {
    "all": 0
};
client.mika = new Mika();
client.redis = redis.createClient();
client.pg = new pg.Client(config.pgconfig);

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

function write_guilds_list(object_to, callback) {
    fs.writeFile("./json/guilds.json", JSON.stringify(object_to), err => {
        if (err) util.log(err);
        callback();
    });
}

var write_usage_stats = schedule.scheduleJob("*/10 * * * *", () => {
    fs.writeFile("./json/usage.json", JSON.stringify(client.all_usage), (err) => {
        if (err) util.log(err);
    });
});

process.on("exit", (code) => {
    util.log(`Exiting with code ${code}`);
    fs.writeFileSync("./json/usage.json", JSON.stringify(client.all_usage));
});

client.pg.on("error", (err, pgclient) => {
    util.error("idle pgclient error", err.message, err.stack);
});

client.on("ready", () => {
    util.log("listen-bot ready.");
    client.shards.forEach(shard => {
        shard.editStatus("online", { "name": `${config.default_prefix}info | ${config.default_prefix}help [${shard.id + 1}/${client.shards.size}]` });
    });

    stats_messages = schedule.scheduleJob("*/15 * * * *", () => {
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
                }),
                {
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
    let qstring = [
        "INSERT INTO public.guilds (id, name, prefix, climit, mlimit) VALUES (",
        `'${guild.id}',`,
        `'${guild.name.replace("'", "")}',`,
        `'--',`,
        `'${0}',`,
        `'${0}'`,
        ");"
    ];
    client.pg.query(qstring.join(" ")).then(() => {
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
            let qstring = [
                "UPDATE public.guilds",
                `SET name = '${guild.name.replace("'", "")}'`,
                `WHERE id = '${guild.id}';`
            ];
            console.log(qstring);
            client.pg.query(qstring.join(" ")).then(() => {
                util.log("  updated guild successfully");
            }).catch(err => {
                util.log("  something went wrong updating");
                util.log(err);
            });
        }
    }).catch(err => {
        util.log(` something went wrong selecting guild ${guild.id}/${guild.name}`);
    });
});

client.on("guildDelete", guild => {
    util.log(`${guild.id}/${guild.name}: left guild`);
    let qstring = [
        "DELETE FROM public.guilds",
        `WHERE id = '${guild.id}';`
    ];
    client.pg.query(qstring.join(" ")).then(() => {
        util.log("  deleted guild successfully");
    }).catch(err => {
        util.log("  something went wrong deleting");
        util.log(err);
    });
});

client.on("messageCreate", message => {
    if (!message.channel.guild) return;
    if (message.member && message.member.bot) return;

    client.guilds_list = guilds_list;
    let _prefix = guilds_list[message.channel.guild.id].prefix;
    let _helper = new Helper(_prefix);

    if (!message.author) {
        _helper.log(message, "no author");
        _helper.log(message, message.content);
        return;
    }

    if (message.author.id == client.user.id) return;
    if (message.content.startsWith(_prefix) || message.content.startsWith(config.default_prefix)) {
        message.content = message.content.replace(config.default_prefix, "").replace(_prefix, "").trim();

        const command = message.content.split(" ").shift();
        let disabled_list = client.guilds_list[message.channel.guild.id].disabled[message.channel.id];
        if (disabled_list && disabled_list.indexOf(command) != -1) {
            _helper.log(message, `permissions error in command ${command}`);
        } else {
            if (command in client.commands) {
                let member_limit = guilds_list[message.channel.guild.id].member_limit
                    ? guilds_list[message.channel.guild.id].member_limit
                    : 0;
                let channel_limit = guilds_list[message.channel.guild.id].channel_limit
                    ? guilds_list[message.channel.guild.id].channel_limit
                    : 0;

                if (!_members[message.member.id] || _members[message.member.id].last_message + member_limit < Date.now()) {
                    if (!_channels[message.channel.id] || _channels[message.channel.id].last_message + channel_limit < Date.now()) {
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
                            client.createMessage(message.channel.id,
                                `\`#${message.channel.name}\` Please cool down! ${Math.floor((_channels[message.channel.id].last_message + channel_limit - Date.now()) / 1000) + 1} second(s) left.`
                            ).then(new_message => {
                                setTimeout(() => { new_message.delete(); }, 4000);
                                _helper.log(message, "channel ratelimited");
                                _channels[message.channel.id].cooldown_sent = true;
                            }).catch(err => _helper.handle(err));
                        }
                    }
                } else {
                    if (!_members[message.member.id].cooldown_sent) {
                        client.createMessage(message.channel.id,
                            `<@!${message.member.id}>, Please cool down! ${Math.floor((_members[message.member.id].last_message + member_limit - Date.now()) / 1000) + 1} second(s) left.`
                        ).then(new_message => {
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
    }
});

// connect to everthing in order
client.redis.on("ready", () => {
    util.log("redis ready.");
    client.pg.connect((err) => {
        if (err) {
            util.error("err conencting to client");
            util.error(err);
            process.exit(1);
        }

        util.log("pg ready.");
        client.connect();
    });
});

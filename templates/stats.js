const eris_version = require("eris/package.json").version;
const prettyms = require("pretty-ms");

module.exports = (client) => {
    return new Promise((resolve) => {
        let plist = [
            client.pg.query("select version();"),
            client.pg.query("select count(*) from users;")
        ];

        Promise.all(plist).then(res => {
            resolve({
                "author": {
                    "name": `Node.js Version: ${process.version}`
                },
                "fields": [{
                    "name": "Eris Version",
                    "value": eris_version,
                    "inline": true
                }, {
                    "name": "Redis Version",
                    "value": client.redis.server_info.versions.join("."),
                    "inline": true
                }, {
                    "name": "Postgres Version",
                    "value": res[0].rows[0].version.split(" ")[1],
                    "inline": true
                }, {
                    "name": "Memory Usage",
                    "value": `${(process.memoryUsage().rss / (1024 * 1024)).toFixed(1)} MB`,
                    "inline": true
                }, {
                    "name": "Redis Usage",
                    "value": `${(client.redis.server_info.used_memory_rss / (1024 * 1024)).toFixed(1)} MB`,
                    "inline": true
                }, {
                    "name": "Registered Users",
                    "value": res[1].rows[0].count,
                    "inline": true
                }, {
                    "name": "Servers / Users",
                    "value": `${client.guilds.size} / ${client.users.size}`,
                    "inline": true
                }, {
                    "name": "Uptime",
                    "value": prettyms(client.uptime),
                    "inline": true
                }, {
                    "name": "Cmds (session / all time)",
                    "value": `${client.usage.stats.all} / ${client.all_usage.stats.all}`,
                    "inline": true
                }],
                "timestamp": new Date().toJSON()
            });
        });
    });
};

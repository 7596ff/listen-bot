const needle = require("needle");
const util = require("util");

module.exports = client => {
    needle.post("https://discord.bots.gg/api/v1/bots/240209888771309568/stats",
	JSON.stringify({ serverCount: client.guilds.size, shardCount: client.shards.size }),
        { "headers": { "Authorization": client.config.dbots_token, "Content-Type": "application/json" }},
        (err, resp) => {
            if (err) {
                util.log(err);
                return;
            } else if (resp.statusCode != 200) {
                util.log(resp.statusCode);
            }
        }
    );
};

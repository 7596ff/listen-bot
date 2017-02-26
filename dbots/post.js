const needle = require("needle");
const util = require("util");

module.exports = client => {
    needle.post(`https://bots.discord.pw/api/bots/${client.config.master_id}/stats`,
        JSON.stringify({ "server_count": client.guilds.size }), 
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

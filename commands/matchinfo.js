const match_embed = require("../util/match_embed");

function check_if_registered(client, dota_id, hero_id) {
    return new Promise((resolve) => {
        client.pg.query({
            "text": "SELECT * FROM public.users WHERE dotaid = $1",
            "values": [dota_id]
        }).then(res => {
            if (res.rowCount != 0) {
                resolve({
                    "discord_id": res.rows[0].id,
                    "hero_id": hero_id
                });
            } else {
                resolve(undefined);
            }
        });
    });
}

function send_message(message, client, helper, match_data, origin) {
    let queries = [];

    match_data.players.forEach(player => {
        queries.push(check_if_registered(client, player.account_id, player.hero_id));
    });

    Promise.all(queries).then(results => {
        let filtered = results.filter(result => result && message.channel.guild.members.find(member => member.id == result.discord_id));
        message.channel.createMessage({
            "embed": match_embed(match_data, filtered),
            "content": message.header || ""
        }).then(() => {
            helper.log(message, `  sent match data from ${origin}`);
        }).catch(err => {
            helper.log(message, "  something went wrong posting a match");
            helper.log(message, err);
        });
    }).catch(err => {
        helper.log(message, "  something went wrong selecting from the database");
        helper.log(message, err);
    });
}

module.exports = (message, client, helper) => {
    let match_id = message.content.split(" ")[1];
    if (!match_id) return;

    if (match_id.match("dotabuff") || match_id.match("opendota")) {
        let url = match_id.split("/");
        match_id = url[url.length - 1];
    }

    if (isNaN(match_id)) {
        message.channel.createMessage("I couldn't find a match ID in your message!");
        return;
    }

    helper.log(message, `matchinfo: ${match_id}`);

    message.channel.sendTyping().then(() => {
        client.redis.get(`matchinfo:${match_id}`, (err, reply) => {
            if (err) helper.log(message, err);
            if (reply) {
                send_message(message, client, helper, JSON.parse(reply), "redis");
            } else {
                client.mika.getMatch(match_id).then(match_data => {
                    send_message(message, client, helper, match_data, "api");
                    client.redis.set(`matchinfo:${match_id}`, JSON.stringify(match_data), (err) => {
                        if (err) helper.log(message, err);
                        client.redis.expire(`matchinfo:${match_id}`, 604800);
                    });
                }).catch(err => {
                    message.channel.createMessage("Something went wrong.");
                    helper.log(message, "  something went wrong with mika");
                    helper.log(message, err);
                });
            }
        });
    });
};

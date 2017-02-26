const check_if_registered = require("../util/check_if_registered");

module.exports = (client, history) => {
    return new Promise((resolve, reject) => {
        let embed = {};
        let queries = [check_if_registered(client, history.p1), check_if_registered(client, history.p2)];

        Promise.all(queries).then(res => {
            if (!res[0] || !res[1]) reject("couldn't find one of the players fsr");
            embed.description = `History between <@${res.find(person => person.dota_id == history.p1).discord_id}> and <@${res.find(person => person.dota_id == history.p2).discord_id}>`;
            embed.fields = [{
                "name": "Same Team",
                "value": [
                    `**Win/Loss:** ${history.winwith}/${history.with - history.winwith} (${history.with} games)`,
                    `**Winrate:** ${(Math.round((history.winwith / history.with) * 10000)) / 100}%`
                ].join("\n"),
                "inline": false
            }, {
                "name": "Different Teams",
                "value": [
                    `**<@${res.find(person => person.dota_id == history.p1).discord_id}>'s wins:** ${history.against[history.p1]}`,
                    `**<@${res.find(person => person.dota_id == history.p2).discord_id}>'s wins:** ${history.against[history.p2]}`,
                ].join("\n"),
                "inline": false
            }];

            resolve(embed);
        }).catch(err => {
            reject(err);
        });
    });
};

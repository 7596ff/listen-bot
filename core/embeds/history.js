module.exports = (client, history, locale) => {
    return new Promise((resolve, reject) => {
        let embed = {};
        let check_if_registered = client.core.util.check_if_registered;
        let queries = [check_if_registered(client, history.p1), check_if_registered(client, history.p2)];

        Promise.all(queries).then(res => {
            if (!res[0] || !res[1]) reject("couldn't find one of the players fsr");
            embed.description = client.sprintf(locale.desc, res.find(person => person.dota_id == history.p1).discord_id, res.find(person => person.dota_id == history.p2).discord_id);
            embed.fields = [{
                "name": locale.same,
                "value": [
                    client.sprintf(locale.wl, history.winwith, history.with - history.winwith, history.with),
                    client.sprintf(locale.wr, Math.round(history.winwith / history.with * 10000) / 100)
                ].join("\n"),
                "inline": false
            }, {
                "name": locale.diff,
                "value": [
                    client.sprintf(locale.wins, res.find(person => person.dota_id == history.p1).discord_id, history.against[history.p1]),
                    client.sprintf(locale.wins, res.find(person => person.dota_id == history.p2).discord_id, history.against[history.p2])
                ].join("\n"),
                "inline": false
            }];

            resolve(embed);
        }).catch(err => {
            reject(err);
        });
    });
};

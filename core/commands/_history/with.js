function find_player_team(match, account_id) {
    let slot = -1;

    for (let hero in match.heroes) {
        if (match.heroes[hero].account_id == account_id) slot = hero;
    }

    return slot < 5;
}

module.exports = (message, client, helper, _with) => {
    let locale = client.core.locale[message.gcfg.locale];
    let resolve_dota_id = client.core.util.resolve_dota_id;
    let embed_history = client.core.embeds.history;

    if (_with.length != 1) {
        message.channel.createMessage(locale.com.history.with.nodata).catch(err => helper.handle(message, err));
        return;
    }

    let qids = _with.length == 1 ? [message.author.id, _with[0]] : [];

    Promise.all(qids.map(id => resolve_dota_id(locale.resolve_dota_id, message, id))).then(results => {
        helper.log(message, `history: ${results[0]} and ${results[1]}`);
        results = results.sort();

        if (results[0] == results[1]) {
            message.channel.createMessage(locale.com.history.with.nodata).catch(err => helper.handle(message, err));
            return;
        }

        let constraints = results.length == 2 ? {
            "included_account_id": results[1]
        } : {};

        client.mika.getPlayerMatches(results[0], constraints).then(matches => {
            let data = {
                "p1": results[0],
                "p2": results[1],
                "total": matches.length,
                "with": 0,
                "winwith": 0
            };

            if (results.length > 1) {
                data.against = {};
                data.against[data.p1] = 0;
                data.against[data.p2] = 0;
            }

            matches.forEach(match => {
                let p1_team = find_player_team(match, results[0]);
                let p2_team = data.against ? find_player_team(match, results[1]) : p1_team;

                if (p1_team == p2_team) {
                    data.with += 1;
                    if (p1_team == match.radiant_win) {
                        data.winwith += 1;
                    }
                } else {
                    p1_team == match.radiant_win ? data.against[results[0]] += 1 : data.against[results[1]] += 1;
                }
            });

            embed_history(client, data, locale.com.history.with.embed).then(embed => {
                message.channel.createMessage({ "embed": embed })
                    .then(() => helper.log(message, "sent history embed"))
                    .catch(err => helper.handle(message, err));
            }).catch(err => {
                message.channel.createMessage(locale.com.history.with.spelling).catch(err => helper.handle(message, err));
                helper.log(message, err);
            });
        }).catch(err => {
            message.channel.createMessage(locale.generic.generic).catch(err => helper.handle(message, err));
            helper.log(message, err);
        });
    }).catch(err => {
        if (err.err) {
            message.channel.createMessage(err.text || locale.generic.generic).catch(err => helper.handle(message, err));
            helper.log(message, err.text);
            helper.log(message, err.err);
        } else if (err.text) {
            message.channel.createMessage(err.text).catch(err => helper.handle(message, err));
            helper.log(message, err.log);
        } else {
            message.channel.createMessage(locale.generic.generic).catch(err => helper.handle(message, err));
            helper.log(message, err);
        }
    });
};

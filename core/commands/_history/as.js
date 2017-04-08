async function as_(message, client, helper, as, _of) {
    let locale = client.core.locale[message.gcfg.locale];

    let resolve_dota_id = client.core.util.resolve_dota_id;
    let find_hero = client.core.util.find_hero;
    let od_heroes = client.core.json.od_heroes;

    if (!_of) _of = message.author;
    let found_hero = false;
    let hero_id = false;
    let hero_nice_name = false;
    
    try { 
        found_hero = await find_hero(as);
        hero_id = od_heroes.find(hero => hero.name == `npc_dota_hero_${found_hero}`).id;
        hero_nice_name = od_heroes.find(hero => hero.name == `npc_dota_hero_${found_hero}`).localized_name;
    } catch (err) {
        if (err === false) {
            helper.log(message, `couldn't find hero ${as}`);
            message.channel.createMessage(locale.generic.noheroerror).catch(err => helper.handle(message, err));
            return;
        }
    }

    if (found_hero == "monkey_king" && message.author.id == "201478932434780160") {
        message.channel.createMessage("face it u fucking lost");
        return;
    }

    resolve_dota_id(locale.resolve_dota_id, message, _of.id).then(account_id => {
        if (account_id.length < 1) {
            message.channel.createMessage(locale.generic.privateaccount).catch(err => helper.handle(message, err));
            return;
        }

        helper.log(message, `history as ${hero_id}`);
        client.mika.getPlayerMatches(account_id, {
            "hero_id": hero_id
        }).then(matches => {
            let wins = matches.filter(match => match.radiant_win == (match.player_slot < 5));
            locale = locale.com.history.as.embed;

            message.channel.createMessage({
                "embed": {
                    "author": {
                        "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${found_hero}_icon.png`,
                        "name": client.sprintf(locale.title, _of.username, hero_nice_name)
                    }, 
                    "description": [
                        client.sprintf(locale.wins, wins.length),
                        client.sprintf(locale.games, matches.length),
                        client.sprintf(locale.wr, Math.round(wins.length / matches.length * 10000) / 100)
                    ].join("\n")
                }
            }).then(() => {
                helper.log(message, "sent history embed");
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            message.channel.createMessage(locale.generic.generic).catch(err => helper.handle(message, err));
            helper.log(message, "something went wrong with mika");
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
}

module.exports = as_;

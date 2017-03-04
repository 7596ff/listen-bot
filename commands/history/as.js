const resolve_dota_id = require("../../util/resolve_dota_id");
const od_heroes = require("../../json/od_heroes.json");
const find_hero = require("../../util/find_hero");

async function as_(message, client, helper, as, _of) {
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
            message.channel.createMessage("I couldn't find that hero.").catch(err => helper.handle(message, err));
            return;
        }
    }

    resolve_dota_id(message, _of.id).then(account_id => {
        if (account_id.length < 1) {
            message.channel.createMessage("This user's account is private.").catch(err => helper.handle(message, err));
            return;
        }

        helper.log(message, `history as ${hero_id}`);
        client.mika.getPlayerMatches(account_id, {
            "hero_id": hero_id
        }).then(matches => {
            let wins = matches.filter(match => match.radiant_win == (match.player_slot < 5));
            message.channel.createMessage({
                "embed": {
                    "author": {
                        "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${found_hero}_icon.png`,
                        "name": `${_of.username} as ${hero_nice_name}`
                    }, 
                    "description": [
                        `**Wins:** ${wins.length}`,
                        `**Games:** ${matches.length}`,
                        `**Winrate:** ${(Math.round((wins.length / matches.length) * 10000)) / 100}%`
                    ].join("\n")
                }
            }).then(() => {
                helper.log(message, "sent history embed");
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            message.channel.createMessage("Something went wrong.").catch(err => helper.handle(message, err));
            helper.log(message, "something went wrong with mika");
            helper.log(message, err);
        })
    })
}

module.exports = as_;

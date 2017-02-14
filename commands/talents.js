const talents = require("../json/talents.json");
const short_heroes = require("../json/short_heroes.json");

const clean = require("../util/clean");

const talent_hero_embed = function(hero_name) {
    let talent_obj = talents[hero_name];
    let talent_arr = [
        `**25:** ${talent_obj["25"][0]} *or* ${talent_obj["25"][1]}`,
        `**20:** ${talent_obj["20"][0]} *or* ${talent_obj["20"][1]}`,
        `**15:** ${talent_obj["15"][0]} *or* ${talent_obj["15"][1]}`,
        `**10:** ${talent_obj["10"][0]} *or* ${talent_obj["10"][1]}`
    ];
    return {
        "author": {
            "name": talents[hero_name]["format_name"],
            "url": `http://dota2.gamepedia.com/${talent_obj.format_name.replace(" ", "_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${talents[hero_name]["true_name"]}_vert.jpg`
        },
        "fields": [
            {
                "name": "Talents",
                "value": talent_arr.join("\n")
            }
        ]
    };
};

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    if (options[1]) {
        let hero = options.slice(1).join(" ").toLowerCase();
        helper.log(message, `talents: hero name (${short_heroes[hero]})`);

        if (hero in short_heroes) {
            message.channel.createMessage({
                "embed": talent_hero_embed(short_heroes[hero])
            }).then(() => {
                helper.log(message, "  sent talents message");
            }).catch(err => helper.handle(message, err));
        }
    }
};

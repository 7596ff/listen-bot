const short_heroes = require("../json/short_heroes.json");
const keys = require("../json/keys.json");
const abilities = require("../json/abilities.json");
const alike_keys = require("../json/alike_keys.json");

const capitalize_first = require("../util/capitalize_first");
const clean = require("../util/clean");

function ability_embed(hero, ability) {
    let ability_obj = abilities[hero][ability];
    let stats = new Array(ability_obj.stats.length, "");
    let effects = new Array(ability_obj.effects.length, "");

    if (ability_obj.stats) {
        for (let stat in ability_obj.stats) {
            let temp_arr = ability_obj.stats[stat].split(": ");
            stats[stat] = `**${temp_arr[0]}** ${temp_arr[1]}`;
        }
    }

    if (ability_obj.effects) {
        for (let eff in ability_obj.effects) {
            let temp_arr = ability_obj.effects[eff].split(": ");
            effects[eff] = `**${temp_arr[0]}** ${temp_arr[1]}`;
        }
    }

    let mana = ability_obj.manacost ? ability_obj.manacost.split(" ").join(" / ") : "None";
    let cool = ability_obj.cooldown ? ability_obj.cooldown.split(" ").join(" / ") : "Passive";
    let desc = ability_obj.description ? ability_obj.description.join("\n") : "";
    let note = ability_obj.notes ? ability_obj.notes.join("\n") : "";
    let agha = ability_obj.agha ? `<:aghanims:273535039814500353> ${ability_obj.agha}` : "";
    let thum = require("../json/config.json").is_discord_shit ? {} : {
        "url": `http://cdn.dota2.com/apps/dota2/images/abilities/${hero}_${clean(ability)}_lg.png`
    };

    return {
        "author": {
            "name": ability,
            "url": `http://dota2.gamepedia.com/${capitalize_first(hero, "_")}#${capitalize_first(ability).replace(" ", "_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero}_vert.jpg`
        },
        "description": [desc, note, agha].join("\n\n").replace("\n\n\n\n", "\n\n"),
        "fields": [
            {
                "name": `<:manacost:273535201337016320> ${mana}`,
                "value": stats.join("\n"),
                "inline": true
            },
            {
                "name": `<:cooldown:273535146320199680> ${cool}`,
                "value": effects.join("\n"),
                "inline": true
            }
        ],
        "thumbnail": thum
    };
}

function create_message(message, client, helper, true_hero, ability, key) {
    if (key == ability) {
        helper.log(message, `ability: hero name (${true_hero}) and ability (${ability})`);
    } else {
        helper.log(message, `ability: hero name (${true_hero}) and ability (${key}: ${ability})`);
    }
    message.channel.createMessage({
        embed: ability_embed(true_hero, ability)
    }).then(() => {
        helper.log(message, "  sent ability message");
    }).catch(err => helper.handle(message, err));
}

module.exports = (message, client, helper) => {
    let options = message.content.toLowerCase().split(" ");
    options.shift();
    for (let i = options.length; i > 0; i--) {
        let key = options.slice(options.length - i, options.length).join(" ");
        let hero = options.slice(0, options.length - i).join(" ");

        if (hero in short_heroes) {
            let true_hero = short_heroes[hero];
            if (true_hero == "invoker" && key.length == 3) key = key.split("").sort().join("");
            if (i > 0 && key in keys[true_hero]) {
                let ability = keys[true_hero][key];
                create_message(message, client, helper, true_hero, ability, key);
                i = 0;
            }

            if (i > 0 && capitalize_first(key) in abilities[true_hero]) {
                create_message(message, client, helper, true_hero, capitalize_first(key), key);
                i = 0;
            }
        } else if (!hero) {
            if (key.length > 1) {
                if (i > 0 && key in alike_keys) {
                    let content = alike_keys[key].length > 1 ? `Did you mean: ${alike_keys[key].join(", ")}` : alike_keys[key][0];

                    message.channel.createMessage(content).then(() => {
                        helper.log(message, `sent redirect for ${key}`);
                    });
                    i = 0;
                } else {
                    for (let key_obj in keys) {
                        if (i > 0 && keys[key_obj][key]) {
                            create_message(message, client, helper, key_obj, keys[key_obj][key], key);
                            i = 0;
                        } else if (i > 0 && keys[key_obj][key.split("").sort().join("")]) {
                            create_message(message, client, helper, key_obj,
                                keys[key_obj][key.split("").sort().join("")], key);
                            i = 0;
                        }
                    }

                    for (let hero_obj in abilities) {
                        if (i > 0 && abilities[hero_obj][capitalize_first(key)]) {
                            create_message(message, client, helper, hero_obj,
                                capitalize_first(key), capitalize_first(key));
                            i = 0;
                        }
                    }
                }
            }
        }
    }
};

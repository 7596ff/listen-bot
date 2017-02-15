const short_heroes = require("../json/short_heroes.json");
const keys = require("../json/keys.json");
const abilities = require("../json/abilities.json");
const alike_keys = require("../json/alike_keys.json");

const capitalize_first = require("../util/capitalize_first");
const clean = require("../util/clean");
const ability_embed = require("../embeds/ability");

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

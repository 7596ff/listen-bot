const abilities = require("../json/abilities.json");
const capitalize_first = require("../util/capitalize_first");

module.exports = (hero, ability) => {
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

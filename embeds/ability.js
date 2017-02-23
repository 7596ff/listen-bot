const clean = require("../util/clean");
const capitalize_first = require("../util/capitalize_first");
const is_discord_shit = require("../json/config.json").is_discord_shit;

module.exports = (ability) => {
    let stats = new Array(ability.stats.length, "");
    let effects = new Array(ability.effects.length, "");

    if (ability.stats) {
        for (let stat in ability.stats) {
            let temp_arr = ability.stats[stat].split(": ");
            stats[stat] = `**${temp_arr[0]}** ${temp_arr[1]}`;
        }
    }

    if (ability.effects) {
        for (let eff in ability.effects) {
            let temp_arr = ability.effects[eff].split(": ");
            effects[eff] = `**${temp_arr[0]}** ${temp_arr[1]}`;
        }
    }

    let mana = ability.manacost ? ability.manacost.split(" ").join(" / ") : "None";
    let cool = ability.cooldown ? ability.cooldown.split(" ").join(" / ") : "Passive";
    let desc = ability.description ? ability.description.join("\n") : "";
    let note = ability.notes ? ability.notes.join("\n") : "";
    let agha = ability.agha ? `<:aghanims:273535039814500353> ${ability.agha}` : "";
    let thum = is_discord_shit ? {} : {
        "url": `http://cdn.dota2.com/apps/dota2/images/abilities/${ability.hero_name}_${clean(ability.name)}_lg.png`
    };

    return {
        "author": {
            "name": ability.name,
            "url": `http://dota2.gamepedia.com/${capitalize_first(ability.hero_name, "_")}#${ability.name.replace(/ /g, "_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${ability.hero_name}_vert.jpg`
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
};

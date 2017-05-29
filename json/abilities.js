var abilities = require("dotaconstants").abilities;
const akeys = require("./keys.json");
const heroes = require("./aliases.json");

for (akey in akeys) {
    abilities[akey].key = akeys[akey];
}

let keys = Object.keys(abilities);
for (hero of heroes) {
    let searchstr = hero.name == "sand_king" ? "sandking" : hero.name; // valve
    let filtered = keys.filter((key) => key.startsWith(searchstr));
    filtered.forEach((key) => {
        abilities[key].hero = hero;
    });
}

abilities = require("../util/transformConstants")(abilities);
abilities = abilities.filter((ability) => ability.hero && !ability.name.startsWith("special_bonus"));

module.exports = abilities;

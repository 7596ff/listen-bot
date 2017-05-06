var abilities = require("dotaconstants").abilities;
const akeys = require("./keys.json");
const heroes = require("./aliases.json");

for (akey in akeys) {
    abilities[akey].key = akeys[akey];
}

let keys = Object.keys(abilities);
for (hero of heroes) {
    let filtered = keys.filter((key) => key.startsWith(hero.name));
    filtered.forEach((key) => {
        abilities[key].hero = hero;
    });
}

abilities = require("../util/transformConstants")(abilities);
abilities = abilities.filter((ability) => ability.hero && !ability.name.startsWith("special_bonus"));

module.exports = abilities;

const hero_abilities = require("dotaconstants").hero_abilities;
const letters = ["q", "w", "e", "d", "f", "r"];

let keys = {};

for (let hero_name of Object.keys(hero_abilities)) {
    let hero = hero_abilities[hero_name];
    for (let index in hero.abilities) {
        keys[hero.abilities[index]] = letters[index];
    }
}

module.exports = keys;


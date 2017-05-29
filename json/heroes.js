const hero_abilities = require("dotaconstants").hero_abilities;
module.exports = Object.values(require("dotaconstants").heroes).map((hero) => {
    hero.abilities = hero_abilities[hero.name].abilities;
    return hero;
});

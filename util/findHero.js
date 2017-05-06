const FuzzySet = require("fuzzyset.js");
const aliases = require("../json/aliases.json");

const fuzzy = FuzzySet([].concat(...aliases.map((hero) => {
    return [hero.name].concat(hero.aliases);
})));

function findHero(string) {
    let exact = aliases.find((hero) => ~hero.aliases.indexOf(string));
    if (exact) return exact;

    let match = fuzzy.get(string);
    if (match) return aliases.find((hero) => ~hero.aliases.indexOf(match[0][1]));

    return false;
}

module.exports = findHero;

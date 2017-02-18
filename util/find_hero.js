const short_heroes = require("../json/short_heroes.json");

module.exports = (hero_name) => {
    return new Promise((resolve, reject) => {
        for (hero in short_heroes) if (short_heroes[hero].includes(hero_name)) resolve(hero);

        reject({ "not_found": true });
    });
};

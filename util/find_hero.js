const short_heroes = require("../json/short_heroes.json");

module.exports = (hero_name) => {
    hero_name = hero_name.toLowerCase();
    return new Promise((resolve, reject) => {
        for (let hero in short_heroes) if (short_heroes[hero].includes(hero_name)) resolve(hero);

        reject(false);
    });
};

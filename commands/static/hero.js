const abilities = require("../../json/abilities");
const heroes = require("../../json/heroes.json");

const findHero = require("../../util/findHero");
const heroEmbed = require("../../embeds/hero");

const qwedfr = {
    "Q": 0,
    "W": 1,
    "E": 2,
    "D": 3,
    "F": 4,
    "R": 5
};

async function exec(ctx) {   
    let alias = ctx.options.join(" ").toLowerCase();
    let res = findHero(alias);
    if (!res) return ctx.send(ctx.client.core.locale[ctx.gcfg.locale].generic.noheroerror);

    let hero_obj = heroes.find((hero) => hero.true_name == res.name);
    hero_obj.abilities = abilities
        .filter((ability) => ability.dname && ability.hero.name == hero_obj.true_name)
        .map((ability) => `${(ability.key || "?").toUpperCase()} - ${ability.dname}`)
        .sort((a, b) => qwedfr[a.charAt(0)] - qwedfr[b.charAt(0)]);

    if (res.name == "troll_warlord") {
        hero_obj.abilities.splice(1, 1);
        hero_obj.abilities[1] = "W - Whirling Axes";
        hero_obj.abilities[2] = "E - Fervor";
    }

    return ctx.embed(heroEmbed(ctx.client, hero_obj));
}

module.exports = {
    name: "hero",
    category: "static",
    triviaCheat: true,
    exec
};

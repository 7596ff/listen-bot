const abilities = require("../../json/abilities");
const heroes = require("../../json/heroes");

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
    if (!res) {
        return ctx.failure(ctx.strings.get("bot_no_hero_error"));
    }

    let hero_obj = heroes.find((hero) => hero.name == `npc_dota_hero_${res.name}`);
    hero_obj = JSON.parse(JSON.stringify(hero_obj));
    hero_obj.abilities = hero_obj.abilities
        .map((ability) => {
            ability = abilities.find((a) => a.name == ability);
            if (!ability) return null;
            return ability.key && `${ability.key.toUpperCase()} - ${ability.dname}`;
        })
        .filter((a) => a)
        .sort((a, b) => qwedfr[a.charAt(0)] - qwedfr[b.charAt(0)]);

    return ctx.embed(heroEmbed(ctx.client, hero_obj));
}

module.exports = {
    name: "hero",
    category: "static",
    triviaCheat: true,
    aliases: ["skills", "abilities"],
    exec
};

const findHero = require("../../util/findHero");
const talentsEmbed = require("../../embeds/talents");
const hero_abilities = require("dotaconstants").hero_abilities;
const abilities = require("dotaconstants").abilities;

async function exec(ctx) {
    let hero = findHero(ctx.options.join(" "));
    if (!hero) {
        return ctx.failure(ctx.strings.get("bot_no_hero_error"));
    }

    let data = {};
    data.hero = hero;
    data.talents = [];

    hero_abilities[`npc_dota_hero_${hero.name}`].talents.forEach((talent) => {
        if (talent.name.startsWith("special_bonus")) {
            talent.dname = abilities[talent.name] ? abilities[talent.name].dname : "?";
            data.talents.push(talent);
        }
    });

    let embed = talentsEmbed(data);
    return ctx.embed(embed);
}

module.exports = {
    name: "talents",
    category: "static",
    triviaCheat: true,
    exec
};

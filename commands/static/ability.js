const abilities = require("../../json/abilities");
const abilityEmbed = require("../../embeds/ability");
const findHero = require("../../util/findHero");

const FuzzySet = require("fuzzyset.js");
const fuzzy = FuzzySet(abilities.filter((a) => a.dname).map((a) => a.dname));

function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

async function exec(ctx) {
    let locale = ctx.client.core.locale[ctx.gcfg.locale].com.ability;

    let hero_name = false;

    let key = ctx.options.find((option) => {
        if (["q", "w", "e", "d", "f", "r"].includes(option.toLowerCase())) return true;
        if (option.toLowerCase().match(/[qwe][qwe][qwe]/) || option.toLowerCase() == "emp") return true;
    });
    if (key) ctx.options.splice(ctx.options.indexOf(key), 1);

    if (key && key.length == 1) {
        hero_name = findHero(ctx.options.join(" "));
        hero_name = hero_name || hero_name.name;
    } else if (key && key.length == 3) {
        hero_name = "invoker";
        if (key == "emp") key = "www";
        key = key.split("").sort().join("");
    }

    if (hero_name == "troll_warlord" && key == "e") key = "d";
    if (hero_name == "troll_warlord" && key == "w" && ctx.content.match("melee")) key = "e";

    let res = fuzzy.get(ctx.options.join(" "));
    let skill = abilities.filter((ability) => {
        if (hero_name) {
            if (ability.hero.name == hero_name && ability.key == key.toLowerCase()) return true;
        } else {
            if (res && res[0][0] > 0.7 && res[0][1] == ability.dname) return true;
        }
    });

    if (skill.length == 1) {
        return ctx.embed(abilityEmbed(skill[0]));
    } else {
        let conflicts = abilities.filter((ability) => ability.dname && ability.dname.toLowerCase().match(ctx.options.join(" ")));
        if (conflicts.length > 1) {
            return ctx.send(ctx.client.sprintf(locale.conflict, conflicts.map(conflict => conflict.dname).join(", "))).then(new_message => {
                setTimeout(function() { this.delete(); }.bind(new_message), 10000);
            });
        } else if (conflicts.length == 1) {
            return ctx.embed(abilityEmbed(conflicts[0]));
        } else {
            return ctx.send(locale.nothing).then(new_message => {
                setTimeout(() => { new_message.delete(); }, 10000);
            });
        }
    }
}

module.exports = {
    name: "ability",
    category: "static",
    aliases: ["skill", "spell"],
    triviaCheat: true,
    exec
};

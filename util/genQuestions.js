const dc = require("dotaconstants");
const aliases = require("../json/aliases.json");
const heroes = require("../json/heroes.json")

const fullnames = {
    "str": "Strength",
    "agi": "Agility",
    "int": "Intelligence"
};

function clean(str) {
    str = str.toString().trim();
    if (`${parseInt(str)}.0` == str) str = str.replace(".0", "");
    return str;
}

function formatAttribute(name, attribute, index, category) {
    let q = `${name}: ${index ? "Level " + (index + 1) : ""} ${attribute.header || ""}${attribute.footer || ""}`;
    if (!q.includes(":")) q += ":";

    return {
        question: q,
        answer: index ? attribute.value[index] : attribute.value,
        category: category
    };
}

function formatTalent(hero, dname) {
    res = dname
        .split(" ")
        .map((item, index, array) => {
            if (!isNaN(item.replace(/[+\-%s\.]/g, ""))) {
                return {
                    "question": `Talents: ${hero}: ${array.slice(0, index).join(" ")} ${Array(item.length).join("•")} ${array.slice(index + 1).join(" ")}`,
                    "answer": clean(item),
                    "category": "talents"
                };
            }
        })
        .filter((a) => a);

    return res;
}

let questions = [];

for (hero_name in dc.hero_abilities) {
    let hero = dc.hero_abilities[hero_name];
    let ahero = aliases.find((alias) => `npc_dota_hero_${alias.name}` == hero_name);

    hero.abilities.forEach((ability_name) => {
        let ability = dc.abilities[ability_name];

        if (ability.dmg_type) {
            questions.push({
                question: `Damage Type: ${ability.dname}?`,
                answer: ability.dmg_type.toLowerCase(),
                category: "abilities"
            });
        }

        if (ability.bkbpierce) {
            questions.push({
                question: `Yes or No: ${ability.dname} pierces BKB`,
                answer: ability.bkbpierce.toLowerCase(),
                category: "abilities"
            });
        }

        if (ability.attrib) {
            ability.attrib.forEach((attribute) => {
                if (Array.isArray(attribute.value)) {
                    attribute.value.forEach((value, index) => questions.push(formatAttribute(ability.dname, attribute, index, "abilities")));
                } else {
                    questions.push(formatAttribute(ability.dname, attribute, false, "abilities"));
                }
            })
        }
    });

    hero.talents.forEach((t) => {
        let talent = dc.abilities[t.name];
        if (talent.dname) questions.push(...formatTalent(ahero.local, talent.dname));
    });
}

for (item_name in dc.items) {
    if (item_name.includes("dagon")) continue;
    if (item_name.includes("diffusal")) continue;
    if (item_name.includes("recipe")) continue;
    if (item_name.includes("necronomicon")) continue;

    let item = dc.items[item_name];

    if (item.cost) {
        questions.push({
            question: `Cost: ${item.dname}?`,
            answer: item.cost,
            category: "items"
        });
    }

    if (item.mc) {
        questions.push({
            question: `Mana Cost: ${item.dname}?`,
            answer: item.mc,
            category: "items"
        });
    }

    if (item.cd) {
        questions.push({
            question: `Cooldown: ${item.dname}?`,
            answer: item.cd,
            category: "items"
        });
    }

    if (item.attrib) {
        item.attrib.forEach((attribute) => {
            questions.push(formatAttribute(item.dname, attribute, false, "items"))
        });
    }

    /*if (item.created) {
        let list = item.components.slice();

        if (Object.keys(dc.items).includes(`recipe_${item_name}`)) {
            list.push(`recipe_${item_name}`);
        }

        list.forEach((iteme, index, array) => {
            if (!dc.items[iteme]) return;

            let without = array.slice();
            without
                .filter((name) => dc.items[name] && dc.items[name].dname)
                .map((name) => dc.items[name].dname)
                .splice(index, 1, Array(iteme.length).join("•"));

            questions.push({
                question: `${item.dname} is built from ${without.join(", ")}`,
                answer: dc.items[iteme].dname,
                category: "items"
            });
        })
    }*/
}

module.exports = questions;

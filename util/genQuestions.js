const dc = require("dotaconstants");
const aliases = require("../json/aliases.json");
const heroes = require("../json/heroes");

const fullnames = {
    "str": "Strength",
    "agi": "Agility",
    "int": "Intelligence"
};

function clean(str) {
    return str.toString().toLowerCase().trim(); // .replace(/[+\-%s\.]/g, "");
}

function formatAttribute(name, attribute, index, category) {
    let q = [];
    if (name) q.push(`${name}:`);
    if (index) q.push(`Level ${parseInt(index) + 1}`);
    attribute.header && q.push(attribute.header);
    attribute.footer && q.push(attribute.footer);
    q = q.filter((a) => a.length).join(" ");
    if (!q.includes(":")) q += ":";

    return {
        question: q,
        answer: clean(index ? attribute.value[index] : attribute.value),
        category: category
    };
}

function formatTalent(hero, dname) {
    res = dname
        .split(" ")
        .map((item, index, array) => {
            if (!isNaN(clean(item))) {
                let q = [];

                q.push(`Talents (${hero}):`);

                let header = array.slice(0, index);
                if (header.length) {
                    q.push(...header);
                }

                q.push(item.replace(/\d/g, "•"));

                let footer = array.slice(index + 1);
                if (footer.length) {
                    q.push(...footer);
                }

                q = q.filter((a) => a.length).join(" ");

                return {
                    "question": q,
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

    for (ability_name of hero.abilities) {
        if (ability_name == "ogre_magi_multicast") continue;

        let ability = dc.abilities[ability_name];

        if (ability.dmg_type) {
            questions.push({
                question: `Damage Type: ${ability.dname}?`,
                answer: ability.dmg_type.toLowerCase(),
                category: "abilities_stats"
            });
        }

        if (ability.bkbpierce) {
            questions.push({
                question: `y/n: ${ability.dname} pierces BKB`,
                answer: ability.bkbpierce.charAt(0).toLowerCase(),
                category: "abilities_stats"
            });
        }

        if (ability.attrib) {
            ability.attrib.forEach((attribute) => {
                if (Array.isArray(attribute.value)) {
                    for (index in attribute.value) {
                        questions.push(formatAttribute(ability.dname, attribute, index, "abilities_attributes"));
                    }
                } else {
                    questions.push(formatAttribute(ability.dname, attribute, false, "abilities_attributes"));
                }
            })
        }
    }

    hero.talents.forEach((t) => {
        let talent = dc.abilities[t.name];
        if (talent.dname) questions.push(...formatTalent(ahero.local, talent.dname));
    });

    let oldHero = aliases.find((h) => h.name == hero_name);

    if (oldHero) {
        questions.push({
            question: `Names/Titles: ${oldHero.local}?`,
            answer: oldHero.oldname,
            category: "hero_names"
        });
        questions.push({
            question: `Names/Titles: ${oldHero.oldname}?`,
            answer: oldHero.local,
            category: "hero_names"
        });
    }
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
            category: "items_stats"
        });
    }

    if (item.mc) {
        questions.push({
            question: `Mana Cost: ${item.dname}?`,
            answer: item.mc,
            category: "items_stats"
        });
    }

    if (item.cd) {
        questions.push({
            question: `Cooldown: ${item.dname}?`,
            answer: item.cd,
            category: "items_stats"
        });
    }

    if (item.attrib) {
        item.attrib.forEach((attribute) => {
            questions.push(formatAttribute(item.dname, attribute, false, "items_attributes"))
        });
    }

    if (item.created) {
        let list = item.components.slice();

        if (Object.keys(dc.items).includes(`recipe_${item_name}`)) {
            list.push(`recipe_${item_name}`);
        }

        list = list.filter((name) => dc.items[name] && dc.items[name].dname);

        list.forEach((iteme, index, array) => {
            if (!dc.items[iteme]) return;

            let without = array.slice();
            without = without.map((name) => dc.items[name].dname);
            without.splice(index, 1, dc.items[iteme].dname.replace(/[^ ]/g, "•"));

            questions.push({
                question: `${item.dname} is built from ${without.join(", ")}`,
                answer: dc.items[iteme].dname,
                category: "items_created"
            });
        })
    }
}

questions = questions
    .filter((q) => q.answer)
    .filter((q) => !q.question.includes("undefined"));

module.exports = questions;

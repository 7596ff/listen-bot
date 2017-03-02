    const abilities = require("../json/abilities.json");
const find_hero = require("../util/find_hero");
const heroes = require("../json/heroes.json");
const hero_embed = require("../embeds/hero");
const ability_embed = require("../embeds/ability");

const qwedfr = {
    "Q": 0,
    "W": 1,
    "E": 2,
    "D": 3,
    "F": 4,
    "R": 5
};

const reverse = {
    "0": "Q",
    "1": "W",
    "2": "E",
    "3": "D",
    "4": "F",
    "5": "R"
};

const unicode = {
    "q": "🇶",
    "w": "🇼",
    "e": "🇪",
    "d": "🇩",
    "f": "🇫",
    "r": "🇷"
};

function react(message, keys) {
    return new Promise((resolve, reject) => {
        message.addReaction(keys[0]).then(() => {
            if (keys.length > 1) {
                react(message, keys.slice(1));
            } else {
                resolve();
            }
        }).catch(err => {
            reject(err);
        });
    });
}

async function secret(message, client, helper) {
    let alias = message.content.split(" ").slice(1).join(" ").toLowerCase();
    helper.log(message, `hero: ${alias}`);
    let res = await find_hero(alias);
    if (!res) return;

    let hero_obj = heroes.find(hero => hero.true_name == res);
    hero_obj.abilities = abilities
        .filter(ability => ability.hero_name == hero_obj.true_name)
        .map(ability => `${ability.key.toUpperCase()} - ${ability.name}`);

    hero_obj.abilities.forEach((item, index) => {
        hero_obj.abilities[index] = item.replace(/[QWEDFR]/, match => qwedfr[match]);
    });

    hero_obj.abilities.sort();

    hero_obj.abilities.forEach((item, index) => {
        hero_obj.abilities[index] = item.replace(/[012345]/, match => reverse[match]);
    });

    let hero_embed_res = hero_embed(hero_obj);

    message.channel.createMessage({
        "embed": hero_embed_res
    }).then((new_message) => {
        helper.log(message, "sent hero embed");
        if (res == "invoker") return;

        client.watching[new_message.id] = { 
            "📊": hero_embed_res,
            "author_id": message.author.id,
            "❌": "lol"
        };
        keys = ["📊"];
        hero_obj.abilities.forEach(ability => {
            let key = ability.charAt(0).toLowerCase();
            let temp_embed = ability_embed(abilities.filter(skill => {
                if (skill.hero_name == res && skill.key == key) return true;
            })[0]);
            client.watching[new_message.id][unicode[key]] = temp_embed;
            keys.push(unicode[key]);
        });
        keys.push("❌")

        react(new_message, keys).then(() => {
            helper.log(message, "reacted to hero embed");
            setTimeout(() => {
                delete client.watching[new_message.id];
            }, 600000);
        }).catch(err => {
            helper.log(message, "something went wrong reacting to message");
            helper.log(err);
        });
    }).catch(err => {
        console.log(err)
    });
};

module.exports = secret;

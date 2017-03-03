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

function react(message, keys, top_resolve) {
    return new Promise((resolve, reject) => {
        message.addReaction(keys[0]).then(() => {
            if (keys.length > 1) {
                react(message, keys.slice(1), top_resolve || resolve);
            } else {
                top_resolve ? top_resolve() : resolve();
            }
        }).catch(err => {
            reject(err);
        });
    });
}

async function secret(message, client, helper) {
    let alias = message.content.split(" ").slice(1).join(" ").toLowerCase();
    helper.log(message, `hero: ${alias}`);
    let res = "";
    try {
        res = await find_hero(alias);
    } catch (err) {
        if (err === false) {
            helper.log(message, `couldn't find hero ${alias}`);
            return;
        }
    }

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
        "content": `To take full advantage of this command, reinvite the bot to your server to give it new permissions! Use \`${message.gcfg.prefix}invite\`.`,
        "embed": hero_embed_res
    }).then((new_message) => {
        helper.log(message, "sent hero embed");
        if (res == "invoker") return;

        let to_redis = { 
            "📊": hero_embed_res,
            "author_id": message.author.id
        };
        let keys = ["📊"];
        hero_obj.abilities.forEach(ability => {
            let key = ability.charAt(0).toLowerCase();
            let temp_embed = ability_embed(abilities.filter(skill => {
                if (skill.hero_name == res && skill.key == key) return true;
            })[0]);
            to_redis[unicode[key]] = temp_embed;
            keys.push(unicode[key]);
        });

        Object.keys(to_redis).forEach(key => {
            client.redis.set(`${new_message.id}:${key}`, JSON.stringify(to_redis[key]), (err) => {
                if (err) console.log(err);
                client.redis.expire(`${new_message.id}:${key}`, 600);
            });
        });

        react(new_message, keys).then(() => {
            helper.log(message, "reacted to hero embed");
        }).catch(err => {
            helper.log(message, "something went wrong reacting to message");
            helper.log(err);
        });
    }).catch(err => helper.handle(message, err));
}

module.exports = secret;

const abilities = require("../json/abilities.json");
const find_hero = require("../util/find_hero");
const heroes = require("../json/heroes.json");
const hero_embed = require("../embeds/hero");

module.exports = (message, client, helper) => {
    let alias = message.content.split(" ").slice(1).join(" ").toLowerCase();
    helper.log(message, `hero: ${alias}`);
    find_hero(alias).then(res => {
        let hero_obj = heroes.find(hero => hero.true_name == res);
        hero_obj.abilities = [];
        for (skill in abilities[res]) hero_obj.abilities.push(skill);

        message.channel.createMessage({
            "embed": hero_embed(hero_obj)
        }).then(() => {
            helper.log(message, "sent hero embed")
        }).catch(err => {
            helper.handle(message, err);
        })
    }).catch(err => {
        if (err.not_found) {
            helper.log(message, `hero: couldn't find ${alias}`);    
        } else {
            helper.log(message, err.toString());
        }
    });
};

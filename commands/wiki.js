const find_hero = require("../util/find_hero");
const od_heroes = require("../json/od_heroes.json");

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    options.shift();
    let hero = options.join(" ");
    find_hero(hero).then(res => {
        let underscore = od_heroes.find(od_hero => od_hero.name == `npc_dota_hero_${res}`).localized_name.split(" ").join("_");
        message.channel.createMessage(`<http://dota2.gamepedia.com/${underscore}>`).then(() => {
            helper.log(message, `sent wiki link (${res})`);
        }).catch(err => helper.handle(message, err));
    }).catch(err => {
        helper.log(message, `wiki: couldn't find hero ${hero}`);
    });
};

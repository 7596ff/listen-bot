const patch_list = require("../../json/patch.json");
const short_heroes = require("../../json/short_heroes.json");

const patch_hero = require("../../embeds/patch_hero");

module.exports = (message, client, helper, hero) => {
    helper.log(message, `patch: hero name (${hero})`);
    for (let hero_list in patch_list.data) {
        if (short_heroes[hero] in patch_list.data[hero_list]["heroes"]) {
            message.channel.createMessage({
                "embed": patch_hero(short_heroes[hero], hero_list)
            }).then(() => {
                helper.log(message, "  sent latest patch message");
            }).catch(err => helper.handle(message, err));
            return;
        }
    }
};

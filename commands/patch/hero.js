const patch_list = require("../../json/patch.json");
const short_heroes = require("../../json/short_heroes.json");

const patch_hero_embed = require("./patch_hero_embed");

module.exports = (message, client, helper, hero) => {
    helper.log(message, `patch: hero name (${short_heroes[hero]})`);
    for (let hero_list in patch_list.data) {
        if (short_heroes[hero] in patch_list.data[hero_list]["heroes"]) {
            client.createMessage(message.channel.id, {
                "embed": patch_hero_embed(short_heroes[hero], hero_list, helper.prefix)
            }).then(() => {
                helper.log(message, "  sent latest patch message");
            }).catch(err => helper.handle(message, err));
            return;
        }
    }
};

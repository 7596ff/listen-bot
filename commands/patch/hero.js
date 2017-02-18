const patch_list = require("../../json/patch.json");
const find_hero = require("../../util/find_hero");

const patch_hero = require("../../embeds/patch_hero");

module.exports = (message, client, helper, hero) => {
    helper.log(message, `patch: hero name (${hero})`);
    find_hero(hero).then(res => {
        for (let hero_list in patch_list.data) {
            if (res in patch_list.data[hero_list]["heroes"]) {
                message.channel.createMessage({
                    "embed": patch_hero(res, hero_list)
                }).then(() => {
                    helper.log(message, "  sent latest patch message");
                }).catch(err => helper.handle(message, err));
                return;
            }
        }
    })
};
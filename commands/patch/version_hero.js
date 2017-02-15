const patch_list = require("../../json/patch.json");
const short_heroes = require("../../json/short_heroes.json");

const patch_hero_embed = require("./patch_hero_embed");

module.exports = (message, client, helper, version, hero) => {
    helper.log(message, `patch: version (${version}) and hero name (${hero})`);
    if (patch_list.data[patch_list.schema.indexOf(version)]["heroes"][short_heroes[hero]]) {
        message.channel.createMessage({
            "embed": patch_hero_embed(short_heroes[hero], patch_list.schema.indexOf(version))
        }).then(() => {
            helper.log(message, "  sent patch message");
        }).catch(err => helper.handle(message, err));
    } else {
        for (let hero_list in patch_list.data) {
            if (short_heroes[hero] in patch_list.data[hero_list]["heroes"]) {
                message.channel.createMessage({
                    "content": "Can't find that version! Here's the latest: ",
                    "embed": patch_hero_embed(short_heroes[hero], hero_list)
                }).then(() => {
                    helper.log(message, "  can't find that version, sent latest patch message");
                }).catch(err => helper.handle(message, err));
                return;
            }
        }
    }
};

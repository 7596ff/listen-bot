const patch_list = require("../../json/patch.json");
const find_hero = require("../../util/find_hero");

const patch_hero = require("../../embeds/patch_hero");

module.exports = (message, client, helper, version, hero) => {
    find_hero(hero).then(res => {
        helper.log(message, `patch: version (${version}) and hero name (${res})`);
        if (patch_list.data[patch_list.schema.indexOf(version)]["heroes"][res]) {
            message.channel.createMessage({
                "embed": patch_hero(res, patch_list.schema.indexOf(version))
            }).then(() => {
                helper.log(message, "  sent patch message");
            }).catch(err => helper.handle(message, err));
        } else {
            for (let hero_list in patch_list.data) {
                if (res in patch_list.data[hero_list]["heroes"]) {
                    message.channel.createMessage({
                        "content": "Can't find that version! Here's the latest: ",
                        "embed": patch_hero(res, hero_list)
                    }).then(() => {
                        helper.log(message, "  can't find that version, sent latest patch message");
                    }).catch(err => helper.handle(message, err));
                    return;
                }
            }
        }
    })
};
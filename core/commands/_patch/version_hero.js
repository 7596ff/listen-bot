module.exports = (message, client, helper, version, hero) => {
    let patch_list = client.core.json.patch;
    let find_hero = client.core.util.find_hero;
    let patch_hero = client.core.embeds.patch_hero;

    find_hero(hero).then(res => {
        helper.log(message, `patch: version (${version}) and hero name (${res})`);
        if (patch_list.data[patch_list.schema.indexOf(version)]["heroes"][res]) {
            message.channel.createMessage({
                "embed": patch_hero(res, patch_list.schema.indexOf(version), patch_list)
            }).then(() => {
                helper.log(message, "  sent patch message");
            }).catch(err => helper.handle(message, err));
        } else {
            for (let hero_list in patch_list.data) {
                if (res in patch_list.data[hero_list]["heroes"]) {
                    message.channel.createMessage({
                        "content": "Can't find that version! Here's the latest: ",
                        "embed": patch_hero(res, hero_list, patch_list)
                    }).then(() => {
                        helper.log(message, "  can't find that version, sent latest patch message");
                    }).catch(err => helper.handle(message, err));
                    return;
                }
            }
        }
    }).catch(() => {
        helper.log(message, `patch hero: couldn't find hero ${hero}`);
    });
};

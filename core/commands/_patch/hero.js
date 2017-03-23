module.exports = (message, client, helper, hero) => {
    let patch_list = client.core.json.patch;
    let find_hero = client.core.util.find_hero;
    let patch_hero = client.core.embeds.patch_hero;

    helper.log(message, `patch: hero name (${hero})`);
    find_hero(hero).then(res => {
        for (let hero_list in patch_list.data) {
            if (res in patch_list.data[hero_list]["heroes"]) {
                message.channel.createMessage({
                    "embed": patch_hero(res, hero_list, patch_list)
                }).then(() => {
                    helper.log(message, "  sent latest patch message");
                }).catch(err => helper.handle(message, err));
                return;
            }
        }
    }).catch(() => {
        helper.log(message, `patch hero: couldn't find hero ${hero}`);
    });
};

module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;

    let patch_list = client.core.json.patch;
    let hero = message.content.split(" ").slice(1).join(" ").toLowerCase();

    client.core.util.find_hero(hero).then(res => {
        let format_name = client.core.json.od_heroes.find(od_hero => od_hero.name == `npc_dota_hero_${res}`).localized_name;
        let patches = [];
        let found = false;
        let patch_seq_num = 0;
        while (!found) {
            if (patch_list.data[patch_seq_num]) {
                if (patch_list.data[patch_seq_num].heroes[res]) {
                    patches.push(patch_list.data[patch_seq_num].version);
                }
            } else {
                found = true;
            }
            patch_seq_num++;
        }
        message.channel.createMessage(`${format_name} has changed in ${patches.join(", ")}`).then(() => {
            helper.log(message, `listed hero (${res})`);
        }).catch(err => helper.handle(message, err));
    }).catch(() => {
        helper.log(message, `list: couldn't find hero ${hero}`);
    });
};

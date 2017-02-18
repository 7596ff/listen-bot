const patch_list = require("../json/patch.json");
const od_heroes = require("../json/od_heroes.json");
const find_hero = require("../util/find_hero");

module.exports = (message, client, helper) => {
    let hero = message.content.toLowerCase().split(" ");
    hero.shift();
    hero = hero.join(" ");

    find_hero(hero).then(res => {
        let format_name = od_heroes.find(od_hero => od_hero.name == `npc_dota_hero_${res}`).localized_name;
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
    }).catch(err => {
        helper.log(message, `list: couldn't find hero ${hero}`);
    });
};

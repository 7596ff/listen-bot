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

        let map = patches.reverse().map((patch) => {
            return {
                "content": `${format_name} has changed in ${patches.join(", ")}\nUse ◀ and ▶ to scroll between patches.`,
                "embed": client.core.embeds.patch_hero(res, patch_list.schema.indexOf(patch), patch_list)
            }
        });

        let perms = message.channel.guild.members.get(client.user.id).permission.has("manageMessages");

        message.channel.createMessage(perms ? map[patches.length - 1] : `${format_name} has changed in ${patches.join(", ")}`).then((new_message) => {
            helper.log(message, `listed hero (${res})`);
            if (perms) client.watchers[new_message.id] = new client.core.util.watcher(client, new_message, message.author.id, "p/n", map);
        }).catch(err => helper.handle(message, err));
    }).catch((err) => {
        helper.log(message, `list: couldn't find hero ${hero}`);
    });
};

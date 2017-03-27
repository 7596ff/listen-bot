module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;
    
    let patch_list = client.core.json.patch;
    let patch_hero = client.core.embeds.patch_hero;
    let options = message.content.split(" ").slice(1);
  
    for (let arg in options) {
        if (client.core.json.patch.schema.includes(options[arg])) {
            let version = options[arg];
            options.splice(options.indexOf(version), 1);
            let hero = options.join(" ");

            client.core.util.find_hero(hero).then(res => {
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
                message.channel.createMessage("Couldn't find that hero.").catch(err => helper.handle(err)).then((msg) => {
                    setTimeout(() => { msg.delete() }, 4000);
                });
            });
            return;
        }
    }

    let hero = options.join(" ");
    client.core.util.find_hero(hero).then(res => {
        helper.log(message, `patch: hero name (${res})`);
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
        message.channel.createMessage("Couldn't find that hero.").catch(err => helper.handle(err)).then((msg) => {
            setTimeout(() => { msg.delete() }, 4000);
        });
    });
};

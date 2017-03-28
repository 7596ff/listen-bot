function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;
    let locale = client.core.locale[message.gcfg.locale].com.ability;
    let abilities = client.core.json.abilities;
    let short_heroes = client.core.json.short_heroes;
    let ability_embed = client.core.embeds.ability;

    let options = message.content.split(" ").slice(1);
    helper.log(message, `ability: ${options.join(" ")}`);
    let hero_name = false;

    let key = options.find(option => {
        if (["q", "w", "e", "d", "f", "r"].includes(option.toLowerCase())) return true;
        if (option.toLowerCase().match(/[qwe][qwe][qwe]/) || option.toLowerCase() == "emp") return true;
    });
    if (key) options.splice(options.indexOf(key), 1);

    if (key && key.length == 1) {
        for (let i = 0; i <= options.length; i++) {
            for (let j = 0; j <= options.length; j++) {
                if (i < j) {
                    for (let hero in short_heroes) {
                        let term = options.slice(i, j).join(" ");
                        if (short_heroes[hero].includes(term)) {
                            hero_name = hero;
                        }
                    }
                }
            }
        }
    } else if (key && key.length == 3) {
        hero_name = "invoker";
        if (key == "emp") key = "www";
        key = key.split("").sort().join("");
    }

    let skill = abilities.filter(ability => {
        if (hero_name) {
            if (ability.hero_name == hero_name && ability.key == key.toLowerCase()) return true;
        } else {
            return RegExp(`\\b${escapeRegExp(options.join(" ").replace(/'/g, ""))}\\b`, "i").test(ability.name.toLowerCase().replace(/'/g, ""));
        }
    });

    if (skill.length == 1) {
        message.channel.createMessage({ "embed": ability_embed(client, skill[0]) })
            .then(() => helper.log(message, "sent ability embed"))
            .catch(err => helper.handle(message, err));
    } else {
        let conflicts = abilities.filter(ability => ability.name.toLowerCase().match(options.join(" ")));
        if (conflicts.length > 1) {
            message.channel.createMessage(client.sprintf(locale.conflict, conflicts.map(conflict => conflict.name).join(", "))).then(new_message => {
                setTimeout(() => { new_message.delete(); }, 10000);
                helper.log(message, "sent not found with conflicts");
            }).catch(err => helper.handle(message, err));
        } else if (conflicts.length == 1) {
            message.channel.createMessage({ "embed": ability_embed(client, conflicts[0]) })
                .then(() => helper.log(message, "sent ability embed"))
                .catch(err => helper.handle(message, err));
        } else {
            message.channel.createMessage(locale.nothing).catch(err => helper.handle(message, err)).then(new_message => {
                setTimeout(() => { new_message.delete(); }, 10000);
                helper.log(message, "sent not found");
            });
        }
    }
};

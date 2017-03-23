const talent_hero_embed = function(talent_obj) {
    let talent_arr = [
        `**25:** ${talent_obj["25"][0]} *or* ${talent_obj["25"][1]}`,
        `**20:** ${talent_obj["20"][0]} *or* ${talent_obj["20"][1]}`,
        `**15:** ${talent_obj["15"][0]} *or* ${talent_obj["15"][1]}`,
        `**10:** ${talent_obj["10"][0]} *or* ${talent_obj["10"][1]}`
    ];
    return {
        "author": {
            "name": talent_obj.format_name,
            "url": `http://dota2.gamepedia.com/${talent_obj.format_name.split(" ").join("_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${talent_obj.true_name}_vert.jpg`
        },
        "fields": [
            {
                "name": "Talents",
                "value": talent_arr.join("\n")
            }
        ]
    };
};

module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;
    
    let hero = message.content.split(" ").slice(1).join(" ").toLowerCase();
    helper.log(message, `talents: hero name (${hero})`);

    client.core.util.find_hero(hero).then(res => {
        message.channel.createMessage({
            "embed": talent_hero_embed(client.core.json.talents[res])
        }).then(() => {
            helper.log(message, "  sent talents message");
        }).catch(err => helper.handle(message, err));
    }).catch(err => {
        if (!err) {
            helper.log(message, `talents: couldn't find ${hero}}`);
        } else {
            helper.log(message, err.toString());
        }
    });
};

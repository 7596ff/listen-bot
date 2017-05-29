    module.exports = (client, hero) => {
    let attrs = {
        str: `${hero.base_str} + ${Number(hero.str_gain)}`,
        agi: `${hero.base_agi} + ${Number(hero.agi_gain)}`,
        int: `${hero.base_int} + ${Number(hero.int_gain)}`
    };

    let val1 = [
        `Lv.1 Damage: oops lol`,
        `Lv.1 HP: oops lol`,
        `Lv.1 Mana: oops lol`,
        `Lv.1 Magic Amp: oops lol`
    ];

    let val2 = [
        `Base Damage: oops lol`,
        `Base MS: ${hero.move_speed}`,
        `Base Armor: ${hero.base_armor}`,
        `Base AT: oops lol`
    ];

    let val3 = [
        `Vision (Day): oops lol`,
        `Vision (Night): oops lol`,
        `Attack Range: ${hero.attack_range} (${hero.attack_type})`,
        `Base MR: ${hero.base_mr}`
    ];

    attrs[hero.primary_attr] = `__${attrs[hero.primary_attr]}__`;

    return {
        "author": {
            "name": hero.localized_name,
            "url": `http://dota2.gamepedia.com/${hero.url}`,
            "icon_url": `http://cdn.dota2.com${hero.icon}`
        },
        "fields": [{
            "name": `${attrs.str} <:strength:281578819721363457>`,
            "value": val1.map(item => `**${item.split(": ")[0]}**: ${item.split(": ")[1]}`).join("\n"),
            "inline": true
        }, {
            "name": `${attrs.agi} <:agility:281578883264806915>`,
            "value": val2.map(item => `**${item.split(": ")[0]}**: ${item.split(": ")[1]}`).join("\n"),
            "inline": true
        }, {
            "name": `${attrs.int} <:intelligence:281578849190281217> `,
            "value": val3.map(item => `**${item.split(": ")[0]}**: ${item.split(": ")[1]}`).join("\n"),
            "inline": true
        }, {
            "name": "Abilities",
            "value": hero.abilities.join(", "),
            "inline": false
        }]
    };
};

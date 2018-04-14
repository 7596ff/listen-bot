module.exports = (client, hero) => {
    let attrs = {
        str: `${hero.base_str} + ${Number(hero.str_gain)}`,
        agi: `${hero.base_agi} + ${Number(hero.agi_gain)}`,
        int: `${hero.base_int} + ${Number(hero.int_gain)}`
    };

    let val1 = [
        `Lv1. Health: ${hero.base_health + Math.round((hero.primary_attr === "str" ? 22.5 : 17) * hero.base_str)}`,
        `Lv1. Armor: ${hero.base_armor + Math.round((hero.primary_attr === "agi" ? 0.2 : 0.16) * hero.base_agi)}`,
        `Lv1. Mana: ${hero.base_mana + ((hero.primary_attr === "int" ? 15 : 12) * hero.base_int)}`,
        `Lv1. Spell Amp: ${Math.round(100 * (0.07 * hero.base_int)) / 100}%`
    ];

    let val2 = [
        `Lv1. Damage: ${hero.base_attack_min + hero[`base_${hero.primary_attr}`]} - ${hero.base_attack_max + hero[`base_${hero.primary_attr}`]}`,
        `BAT: ${hero.attack_rate}`,
        `Attack Range: ${hero.attack_range} (${hero.attack_type})`,
        `Projectile Speed: ${hero.projectile_speed}`
    ];

    let val3 = [
        `Move Speed: ${hero.move_speed}`,
        `Turn Rate: ${hero.turn_rate}`,
        `In Captains mode: ${hero.cm_enabled ? "Yes" : "No"}`,
        `Legs: ${hero.legs}`
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
            "name": `${attrs.agi} <:agility:333769662515118080>`,
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

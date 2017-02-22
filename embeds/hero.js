module.exports = hero => {
    let attrs = {
        str: `${hero.basestr} + ${hero.strgain}`,
        agi: `${hero.baseagi} + ${hero.agigain}`,
        int: `${hero.baseint} + ${hero.intgain}`
    };

    let val1 = [
        `Lv.1 Damage: ${hero.damage1}`,
        `Lv.1 HP: ${hero.hp1}`,
        `Lv.1 Mana: ${hero.mana1}`,
        `Lv.1 Magic Amp: ${hero.amp1}`
    ];

    let val2 = [
        `Base Damage: ${hero.basedmg}`,
        `Base MS: ${hero.basespeed}`,
        `Base Armor: ${hero.basearmor}`,
        `Base AT: ${hero.attacktime}`
    ];

    let val3 = [
        `Vision (Day): ${hero.sightrange.Day}`,
        `Vision (Night): ${hero.sightrange.Night}`,
        `Attack Range: ${hero.attackrange.Ranged || "150"}`,
        `Base MR: ${hero.magicres}`
    ];

    attrs[hero.mainattribute] = `__${attrs[hero.mainattribute]}__`;

    return {
        "author": {
            "name": hero.format_name,
            "url": `http://dota2.gamepedia.com/${hero.format_name.replace(/ /g, "_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.true_name}_vert.jpg`
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
            "name": "Abilities in no particular order",
            "value": hero.abilities.join(", "),
            "inline": false
        }]
    };
};

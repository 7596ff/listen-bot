function patchEmbed(changes, hero, version) {
    return {
        "author": {
            "name": hero.local,
            "url": `http://dota2.gamepedia.com/${hero.local.replace(/ /g, "_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_vert.jpg`
        },
        "footer": {
            "text": `Changes from ${version}`
        },
        "fields": [{
            "name": "Changes",
            "value": changes.join("\n")
        }]
    };
}

module.exports = patchEmbed;

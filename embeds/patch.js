function patchEmbed(data, version) {
    return {
        "author": {
            "name": data["format_name"],
            "url": `http://dota2.gamepedia.com/${data.format_name.replace(/ /g, "_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${data.true_name}_vert.jpg`
        },
        "footer": {
            "text": `Changes from ${version}`
        },
        "fields": [{
            "name": "Changes",
            "value": data.changes.join("\n")
        }]
    };
}

module.exports = patchEmbed;
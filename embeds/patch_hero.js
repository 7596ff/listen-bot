const patch_list = require("../json/patch.json");

function patch_hero_embed(hero_name, version) {
    let hero_obj = patch_list.data[version]["heroes"][hero_name];

    return {
        "author": {
            "name": hero_obj["format_name"],
            "url": `http://dota2.gamepedia.com/${hero_obj.format_name.replace(/ /g, "_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero_obj.true_name}_vert.jpg`
        },
        "footer": {
            "text": "Changes from " + patch_list.schema[version]
        },
        "fields": [
            {
                "name": "Changes",
                "value": hero_obj["changes"].join("\n")
            }
        ]
    };
}

module.exports = patch_hero_embed;

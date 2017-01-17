const patch_list = require('../../json/patch.json')
const short_heroes = require('../../json/short_heroes.json')

function patch_hero_embed(hero_name, version, prefix) {
  let hero_obj = patch_list.data[version]['heroes'][hero_name]

  return {
    "author": {
      "name": hero_obj['format_name'],
      "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero_obj['true_name']}_vert.jpg`
    },
    "footer": {
      "text": "Changes from " + patch_list.schema[version]
    },
    "fields": [
      {
        "name": "Changes",
        "value": hero_obj['changes'].join('\n')
      }
    ],
    "description": `Looking for talents? Try \`${prefix}talents ${hero_obj['format_name'].toLowerCase()}\`.`
  }
}

module.exports = patch_hero_embed

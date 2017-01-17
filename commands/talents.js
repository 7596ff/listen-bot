const talents = require('../json/talents.json')
const short_heroes = require('../json/short_heroes.json')

const talent_hero_embed = function(hero_name) {
  let talent_obj = talents[hero_name].talents
  return {
    "author": {
      "name": talents[hero_name]['format_name'],
      "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${talents[hero_name]['true_name']}_vert.jpg`
    },
    "fields": [
      {
        "name": "Talents",
        "value": `**25:** ${talent_obj["25"][0]} *or* ${talent_obj["25"][1]}\n**20:** ${talent_obj["20"][0]} *or* ${talent_obj["20"][1]}\n**15:** ${talent_obj["15"][0]} *or* ${talent_obj["15"][1]}\n**10:** ${talent_obj["10"][0]} *or* ${talent_obj["10"][1]}`
      }
    ]
  }
}

module.exports = (message, client, helper) => {
  let options = message.content.split(' ')
  if (options[1]) {
    let hero = options.slice(1).join(' ').toLowerCase()
    helper.log(message, `talents: hero name (${short_heroes[hero]})`)

    if (hero in short_heroes) {
      client.createMessage(message.channel.id, {"embed": talent_hero_embed(short_heroes[hero])}).then(new_message => {
        helper.log(message, '  sent talents message')
      }).catch(err => helper.log(message, err))
    }
  }
}

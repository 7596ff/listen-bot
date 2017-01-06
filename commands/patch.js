const patch_list = require('../json/patch.json')
const short_heroes = require('../json/short_heroes.json')

const patch_hero_embed = function(hero_name, version, prefix) {
  let hero_obj = patch_list.data[version]['heroes'][hero_name]

  return {
    "author": {
      "name": hero_obj['format_name'],
      "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero_obj['true_name']}_vert.jpg`
    },
    "footer": {
      "text": "Accurate as of " + patch_list.schema[version]
    },
    "timestamp": new Date().toJSON(),
    "fields": [
      {
        "name": "Changes",
        "value": hero_obj['changes'].join('\n')
      }
    ],
    "description": `Looking for talents? Try \`${prefix}talents <hero name>\`.`
  }
}

module.exports = (message, client, helper) => {
  let options = message.content.split(' ')
  if (options[1]) {
    if (!isNaN(options[1])) {
        if (options[2]) {
          let hero_name = options.slice(2).join(' ').toLowerCase()
          helper.log(message, `patch: version (${options[1]}) and hero name (${hero_name})`)
          if (patch_list.schema.includes(options[1])) {
            if (hero_name in short_heroes) {
              if (short_heroes[hero_name] in patch_list.data[patch_list.schema.indexOf(options[1])]['heroes']) {
                client.createMessage(message.channel.id, {"embed": patch_hero_embed(short_heroes[hero_name], patch_list.schema.indexOf(options[1]), helper.prefix)}).then(new_message => {
                  helper.log(message, '  sent patch message')
                }).catch(err => helper.log(message, err))
              } else { 
                for (hero_list in patch_list.data) {
                  if (short_heroes[hero_name] in patch_list.data[hero_list]['heroes']) {
                    client.createMessage(message.channel.id, {"embed": patch_hero_embed(short_heroes[hero_name], hero_list, helper.prefix)}).then(new_message => {
                      helper.log(message, '  sent latest patch message')
                    }).catch(err => helper.log(message, err))
                  }
                }
              }
            } else {
              client.createMessage(message.channel.id, 'Hero not found.').then(new_message => {
                helper.log(message, '  sent hero not found message')
              }).catch(err => helper.log(message, err))
            }
          } else {
            helper.log(message, '  could\'nt find patch number.')
            client.createMessage(message.channel.id, {
              "content": 'Can\'t find that version! Here\'s the latest: ', 
              "embed": patch_hero_embed(short_heroes[hero_name], 0)
            }).then(new_message => {
              helper.log(message, '  sent patch message (latest version)')
            }).catch(err => helper.log(message, err))
          }
        } else {
          helper.log(message, 'patch: version with no hero name')
          client.createMessage(message.channel.id, 'Please supply a hero!')
        }
    } else {
      let hero_name = options.slice(1).join(' ').toLowerCase()
      helper.log(message, `patch: hero name (${hero_name})`)
      
      if (hero_name in short_heroes) {
        for (hero_list in patch_list.data) {
          if (short_heroes[hero_name] in patch_list.data[hero_list]['heroes']) {
            client.createMessage(message.channel.id, {"embed": patch_hero_embed(short_heroes[hero_name], hero_list, helper.prefix)}).then(new_message => {
              helper.log(message, '  sent latest patch message')
            }).catch(err => helper.log(message, err))
            return
          }
        }
      } else {
        client.createMessage(message.channel.id, 'Hero not found.').then(new_message => {
          helper.log(message, '  sent hero not found message')
        }).catch(err => helper.log(message, err))
      }
    }
  } else {
    helper.log(message, 'patch: no hero')
    client.createMessage(message.channel.id, `Please supply a hero! Try \`${helper.prefix}help patch\`.`)
  }
}
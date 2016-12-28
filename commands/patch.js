const patch_list = require('../json/patch.json')
const short_heroes = require('../json/short_heroes.json')
const util = require('util')

const patch_hero_embed = function(hero_name, version) {
  hero_name = hero_name.toLowerCase()
  let hero_obj = patch_list.data[version]['heroes'][hero_name]
  let talent_obj = hero_obj['talents']

  return {
    "embed": {
      "author": {
        "name": hero_obj['format_name'],
        "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero_obj['true_name']}_vert.jpg`
      },
      "footer": {
        "text": "Accurate as of " + patch_list.schema[version]
      },
      "timestamp": (new Date()).toJSON(),
      "fields": [
        {
          "name": "Changes",
          "value": hero_obj['changes'].join('\n')
        },
        {
          "name": "Talents",
          "value": `**10:** ${talent_obj["10"][0]} *or* ${talent_obj["10"][1]}\n**15:** ${talent_obj["15"][0]} *or* ${talent_obj["15"][1]}\n**20:** ${talent_obj["20"][0]} *or* ${talent_obj["20"][1]}\n**25:** ${talent_obj["25"][0]} *or* ${talent_obj["25"][1]}`
        }
      ]
    }
  }
}

module.exports = message => {
  let options = message.content.split(' ')
  if (options[1]) {
    if (!isNaN(options[1])) {
        if (options[2]) {
          let hero_name = options.slice(2).join(' ').toLowerCase()
          message.client.log(`patch: version (${options[1]}) and hero name (${hero_name})`)
          if (patch_list.schema.includes(options[1])) {
            if (hero_name in short_heroes) {
              if (short_heroes[hero_name] in patch_list.data[patch_list.schema.indexOf(options[1])]['heroes']) {
                message.channel.sendMessage('', patch_hero_embed(short_heroes[hero_name], patch_list.schema.indexOf(options[1]))).then(new_message => {
                  message.client.log('  sent patch message')
                }).catch(err => message.client.log(err))
              } else { 
                for (hero_list in patch_list.data) {
                  if (short_heroes[hero_name] in patch_list.data[hero_list]['heroes']) {
                    message.channel.sendMessage('', patch_hero_embed(short_heroes[hero_name], hero_list)).then(new_message => {
                      message.client.log('  sent latest patch message')
                    }).catch(err => message.client.log(err))
                  }
                }
              }
            } else {
              message.channel.sendMessage('Hero not found.').then(new_message => {
                message.client.log('  sent hero not found message')
              }).catch(err => message.client.log(err))
            }
          } else {
            message.client.log('  could\'nt find patch number.')
            message.channel.sendMessage('Can\'t find that version! Here\'s the latest: ', patch_hero_embed(short_heroes[hero_name], 0)).then(new_message => {
              message.client.log('  sent patch message (latest version)')
            }).catch(err => message.client.log(err))
          }
        } else {
          message.client.log('patch: version with no hero name')
          message.channel.sendMessage('Please supply a hero!')
        }
    } else {
      let hero_name = options.slice(1).join(' ').toLowerCase()
      message.client.log(`patch: hero name (${hero_name})`)
      
      if (hero_name in short_heroes) {
        for (hero_list in patch_list.data) {
          if (short_heroes[hero_name] in patch_list.data[hero_list]['heroes']) {
            message.channel.sendMessage('', patch_hero_embed(short_heroes[hero_name], hero_list)).then(new_message => {
              message.client.log('  sent latest patch message')
            }).catch(err => message.client.log(err))
            return
          }
        }
      } else {
        message.channel.sendMessage('Hero not found.').then(new_message => {
          message.client.log('  sent hero not found message')
        }).catch(err => message.client.log(err))
      }
    }
  } else {
    message.client.log('patch: no hero')
    message.channel.sendMessage(`Please supply a hero! Try \`${_prefix}help patch\`.`)
  }
}
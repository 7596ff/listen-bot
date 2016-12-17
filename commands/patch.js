const patch_list = require('../json/patch.json')
var short_heroes = require('../json/short_heroes.json')
const util = require('util')

const patch_hero_embed = function(hero_name, version) {
  hero_name = hero_name.toLowerCase()
  let hero_obj = patch_list[version]['heroes'][hero_name]
  let talent_obj = hero_obj['talents']

  return {
    "embed": {
      "author": {
        "name": hero_obj['format_name'],
        "icon_url": `http://cdn.dota2.com/apps/dota2/images/heroes/${hero_obj['true_name']}_vert.jpg`
      },
      "footer": {
        "text": "Accurate as of 7.00"
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
          message.client.log(`${message.client.log_string}got a patch version with my hero`)
          
          if (hero_name in short_heroes) {
            message.channel.sendMessage('', patch_hero_embed(short_heroes[hero_name], 'latest')).then(new_message => {
              message.client.log('  sent patch message')
            }).catch(err => message.client.log(err))
          } else {
            message.channel.sendMessage('Hero not found.').then(new_message => {
              message.client.log('  sent hero not found message')
            }).catch(err => message.client.log(err))
          }
        } else {
          message.client.log('got no hero with my patch version')
          message.channel.sendMessage('Please supply a hero!')
        }
    } else {
      message.client.log('got no patch version with my hero')
      let hero_name = options.slice(1).join(' ').toLowerCase()
      
      if (hero_name in short_heroes) {
        message.channel.sendMessage('', patch_hero_embed(short_heroes[hero_name], 'latest')).then(new_message => {
          message.client.log('  sent patch message')
        }).catch(err => message.client.log(err))
      } else {
        message.channel.sendMessage('Hero not found.').then(new_message => {
          message.client.log('  sent hero not found message')
        }).catch(err => message.client.log(err))
      }
    }
  } else {
    message.client.log('got no hero')
    message.channel.sendMessage(`Please supply a hero! Try \`${_prefix}help patch\`.`)
  }
}
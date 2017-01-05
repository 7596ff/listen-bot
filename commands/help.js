const help_topics = require('../json/help.json')
var guilds_list = require('../json/guilds.json')
const util = require('util')

const help_embed = function(help_obj, prefix) {
  return {
    'embed': {
      'author': {
        'name': 'Usage: ' + prefix + help_obj.usage
      },
      'description': help_obj.text.join(''),
      'footer': {
        'text': help_obj.name
      },
      'timestamp': new Date().toJSON()
    }
  }
}

module.exports = (message, client, helper) => {
  let options = message.content.split(' ')
  let specific_topic = options[1]
  if (specific_topic in help_topics) {
    client.createMessage(message.channel.id, help_embed(help_topics[specific_topic], helper.prefix)).then(message => {
      helper.log(message, `Helped with topic ${specific_topic}`)
    }).catch(err => helper.log(message, err))
  } else {
    let help_list = ''
    for (topic in help_topics) {
      if (topic == 'ip') {
        if (guilds_list[message.guild.id].ip) help_list += `\`${topic}\` `
      } else {
        help_list += `\`${topic}\` `;
      }
    }
    let conditional = (options[1]) ? 'Help topic not found: `' + options[1] + '`. ' : ''
    if (conditional != '') helper.log(message, 'could not help with ' + options[1])
    client.createMessage(message.channel.id, `${conditional}List of help topics: ${help_list}`).then(message => {
      helper.log(message, 'helped with all topics')
    }).catch(err => helper.log(message, err))
  }
}
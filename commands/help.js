const help_topics = require('../json/help.json')
var guilds_list = require('../json/guilds.json')
const util = require('util')

const help_embed = function(help_obj, prefix) {
  return {
    'embed': {
      'author': {
        'name': help_obj.name
      },
      'fields': [
        {
          "name": "Usage",
          "value": `${prefix}${help_obj.usage}`,
          "inline": true
        },
        {
          "name": "Example",
          "value": `${prefix}${help_obj.example}`,
          "inline": true
        }
      ],
      'description': help_obj.text.join('')
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
      if (topic != 'quote') {
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
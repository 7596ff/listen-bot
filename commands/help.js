const help_topics = require('../json/help.json')
const cmdlist = require('../util/consts.json').cmdlist
var guilds_list = require('../json/guilds.json')
const util = require('util')

const help_embed = function (help_obj, prefix) {
  fields = []

  if (help_obj.usage) fields.push({
    "name": "Usage",
    "value": `\`${prefix}${help_obj.usage}\``,
    "inline": true
  })

  if (help_obj.example) fields.push({
    "name": "Example",
    "value": `\`${prefix}${help_obj.example}\``,
    "inline": true
  })

  return {
    'embed': {
      'author': {
        'name': help_obj.name
      },
      'fields': fields,
      'description': help_obj.text.join('')
    }
  }
}

module.exports = (message, client, helper) => {
  let options = message.content.split(' ')
  options.shift()
  let specific_topic = options.join(' ')
  if (specific_topic in help_topics) {
    client.createMessage(message.channel.id, help_embed(help_topics[specific_topic], helper.prefix)).then(new_message => {
      helper.log(new_message, `Helped with topic ${specific_topic}`)
    }).catch(err => helper.handle(message, err))
  } else {
    let help_list = ''
    for (topic in help_topics) {
      let disabled_list = client.guilds_list[message.channel.guild.id].disabled[message.channel.id]
      disabled_list = disabled_list ? disabled_list : []  // lol
      if (disabled_list && disabled_list.indexOf(topic) == -1 && topic != "eval") {
        if (topic.match('admin')) {
          if (message.member.permission.has('manageMessages')) help_list += `\`${topic}\` `;
        } else {
          help_list += `\`${topic}\` `;
        }
      }
    }
    let conditional = specific_topic ? `Help topic not found: \`${specific_topic}\`. ` : ''
    if (conditional != '') helper.log(message, 'could not help with ' + specific_topic)
    client.createMessage(message.channel.id, `${conditional}List of help topics: ${help_list}`).then(new_message => {
      helper.log(new_message, 'helped with all topics')
    }).catch(err => helper.handle(message, err))
  }
}

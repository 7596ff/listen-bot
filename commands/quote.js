const guilds_list = require('../json/guilds.json')

module.exports = (message, client, helper) => {  
  var options = message.content.slice(6).split('|')
  for (option in options) option.trim()
  var data = {}

  if (options.length != 3) {
    client.createMessage(message.channel.id, helper.error(`Please format your quote properly! Try \`${helper.prefix}help quote.\``))
    return
  }

  if (guilds_list[message.guild.id].starboard == "none") {
    client.createMessage(message.channel.id, helper.error('Please set up a starboard first!'))
    return
  }

  data.user = client.users.get(options[0].replace(/[^0-9.]/g, ""))

  if (!data.user) {
    client.createMessage(message.channel.id, helper.error('User not found!'))
    return
  }

  if (data.user.id == message.author.id) {
    client.createMessage(message.channel.id, helper.error("You can't quote yourself!"))
    return
  }

  client.createMessage(guilds_list[message.guild.id].starboard, {
    'embed': {
      "author": {
        "icon_url": data.user.avatarURL,
        "name": data.user.username
      },
      "description": options[2],
      "footer": {
        "text": "Playing " + options[1]
      },
      "timestamp": new Date().toJSON()
    }
  }).then(new_message => {
    helper.log(message, `added a quote`)
    client.createMessage(message.channel.id, ':ok_hand:')
  }).catch(err => {
    helper.log(message, 'failed to send the message to the starboard channel')
    client.createMessage(message.channel.id, ':japanese_goblin: I probably don\'t have permission to send to your starboard channel!')
    helper.log(message, err)
  })
}

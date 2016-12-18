const guilds_list = require('../json/guilds.json')

module.exports = message => {  
  let options = message.content.split(' ')
  var data = {}
  
  if (!options[1]) {
    message.channel.sendMessage(':octagonal_sign: Please use the proper arguments!')
    return
  }

  if (guilds_list[message.guild.id].starboard == "none") {
    message.channel.sendMessage(':octagonal_sign: Please set up a starboard first!')
    return
  }

  data.user = message.guild.members.get(options[1].replace(/[^0-9.]/g, ""));

  if (!data.user) {
    message.channel.sendMessage(':octagonal_sign: Please supply a valid username!')
    return
  } 

  if (data.user.user.id == message.author.id) {
    message.channel.sendMessage(":octagonal_sign: You can't quote yourself!")
    return
  } 
  
  options.splice(0, 2)
  data.game = options.join(' ')

  if (data.game.length == 0) {
    message.channel.sendMessage(":octagonal_sign: Please supply a game!")
    return
  }

  message.channel.sendMessage('Please enter the quote below: ')
  message.channel.awaitMessages(message2 => message2.member.id == message.member.id, {
    maxMatches: 1, time: 60000, errors: ['time']
  }).then(collected => {
    let matchedMessage = collected.first()
    data.quote = matchedMessage.content
    let embed = {
      'embed': {
        "author": {
          "icon_url": data.user.user.avatarURL,
          "name": data.user.user.username
        },
        "description": data.quote,
        "footer": {
          "text": "Playing " + data.game
        },
        "timestamp": (new Date()).toJSON()
      }
    }
    message.client.channels.get(guilds_list[message.guild.id].starboard).sendMessage('', embed).then(new_message => {
      message.client.log(`added a quote`)
      message.channel.sendMessage(':ok_hand:')
    }).catch(err => {
      message.client.log('failed to send the message to the starboard channel')
      message.channel.sendMessage(':japanese_goblin: I probably don\'t have permission to send to your starboard channel!')
      message.client.log(err)
    })
  }).catch(err => {
    message.client.log('failed to quote stuff')
    message.client.log(err)
  })
}
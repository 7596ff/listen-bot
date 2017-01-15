module.exports = (message, client, helper) => {
  client.createMessage(message.channel.id, {"embed": {
    "fields": [
      {
        "name": "GitHub",
        "value": "https://github.com/bippum/listen-bot"
      },
      {
        "name": "Invite to your server", 
        "value": "https://discordapp.com/oauth2/authorize?permissions=19456&scope=bot&client_id=240209888771309568"
      }
    ],
    "timestamp": new Date().toJSON(),
    "description": "A Dota 2 related bot. Features include current talents and patch notes for 6.79+ heroes. Contact <@102645408223731712> for support and questions!"
  }}).then(new_message => {
    helper.log(message, 'sent info message')
  }).catch(err => helper.log(message, err))
}

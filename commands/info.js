module.exports = message => {
  message.channel.sendMessage('', {"embed": {
    "fields": [
      {
        "name": "GitHub",
        "value": "https://github.com/brendan10211/listen-bot"
      }
    ],
    "timestamp": (new Date()).toJSON(),
    "description": "A Dota 2 related bot by <@102645408223731712>. Features include patch notes for 7.00 heroes, more in the pipeline."
  }}).then(new_message => {
    message.client.log('sent info message')
  }).catch(err => message.client.log(err))
}
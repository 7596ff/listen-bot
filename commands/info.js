module.exports = (message, client, helper) => {
  client.createMessage(message.channel.id, {"embed": {
    "fields": [
      {
        "name": "GitHub",
        "value": "https://github.com/bippum/listen-bot"
      }
    ],
    "timestamp": new Date().toJSON(),
    "description": "A Dota 2 related bot by <@102645408223731712>. Features include patch notes for 7.00+ heroes, more in the pipeline."
  }}).then(new_message => {
    helper.log(message, 'sent info message')
  }).catch(err => helper.log(message, err))
}

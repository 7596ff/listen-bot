const Discord = require('discord.js')
const token = require('./json/config.json').token
const client = new Discord.Client({
  disabledEvents: [
    'PRESENCE_UPDATE',
    'TYPING_START',
    'TYPING_STOP',
    'VOICE_STATUS_UPDATE',
    'FRIEND_ADD',
    'FRIEND_REMOVE'
  ],
  disableEveryone: true
})

const util = require('util')
const fs = require('fs')
const path = require('path')

var public_ip = require('public-ip');
var guilds_list = require('./json/guilds.json')
var commands = {}

var write_obj = function(object_to, callback) {
  fs.writeFile('guilds.json', JSON.stringify(object_to), err => {
    if (err) util.log(err)
    callback();
  })
}

client.on('ready', () => {
  fs.readdir('./commands/', (err, files) => {
    if (err) util.log(err)
    for (file of files) {
      commands[file.slice(0, -3)] = require(`./commands/${file}`)
    }
    util.log('commands loaded.')
  })
  util.log('listen-bot ready.')
})

client.on('guildCreate', guild => {
  util.log(`new guild joined: ${guild.id}/${guild.name}`)

  util.log('  creating guild object')
  guilds_list[guild.id] = {
    "name": guild.name,
    "prefix": "L!",
    "ip": false,
    "starboard": 'none',
    "starboard_emoji": "⭐"
  }

  write_obj(guilds_list, () => {
    util.log('  wrote new guild config successfully')
  })
})

client.on('guildDelete', guild => {
  util.log(`guild left: ${guild.id}/${guild.name}`)
  delete guilds_list[guild.id]
  
  write_obj(guilds_list, () => {
    util.log('  removed guild successfully')
  })
})

client.on('message', message => {
  _prefix = guilds_list[message.guild.id].prefix

  if (message.author.id == client.user.id) return
  if (!message.content.startsWith(_prefix)) return

  message.content = message.content.replace(_prefix, "").trim();

  const command = message.content.split(' ').shift().toLowerCase()
  if (command in commands) {
    message.client.prefix = _prefix
    message.client.log = text => {
      require('util').log(`${message.guild.id}/${message.guild.name}: ${text}`)
    }

    message.client.error = text => {
      message.channel.sendMessage(`:octagonal_sign: ${text}`)
    }

    commands[command](message)
  } else {
    util.log(`${message.guild.id}/${message.guild.name}: malformed command used`)
  }
})

client.login(token)
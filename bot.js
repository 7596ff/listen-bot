const Eris = require('eris')
const client = new Eris(require('./json/config.json').token)

const util = require('util')
const fs = require('fs')

const default_prefix = "--"

var guilds_list = require('./json/guilds.json')
var commands = {}
for (cmd of require('./consts').cmdlist) {
  commands[cmd] = require(`./commands/${cmd}`)
}

function Helper(prefix) {
  this.prefix = prefix
  this.log = (message, text) => {
    require('util').log(`${message.guild.id}/${message.guild.name}: ${text}`)
  }
  this.error = text => {
    return `:octagonal_sign: ${text}`
  }
}

var write_obj = function(object_to, callback) {
  fs.writeFile('./json/guilds.json', JSON.stringify(object_to), err => {
    if (err) util.log(err)
    callback();
  })
}

client.on('ready', () => {
  util.log('listen-bot ready.')
  client.editStatus("online", {"name": `try ${default_prefix}help`})
})

client.on('guildCreate', guild => {
  util.log(`${guild.id}/${guild.name}: joined guild`)

  util.log('  creating guild object')
  guilds_list[guild.id] = {
    "name": guild.name,
    "prefix": default_prefix,
    "starboard": 'none',
    "starboard_emoji": "⭐",
    "disabled": {}
  }

  write_obj(guilds_list, () => {
    util.log('  wrote new guild config successfully')
  })
})

client.on('guildUpdate', guild => {
  if (guilds_list[guild.id].name != guild.name) {
    util.log(`${guild.id}/${guild.name}: guild updated, modifying name`)
    guilds_list[guild.id].name = guild.name
    write_obj(guilds_list, () => {
      util.log('  wrote new guild config successfully')
    })
  }
})

client.on('guildDelete', guild => {
  util.log(`${guild.id}/${guild.name}: left guild`)
  delete guilds_list[guild.id]
  
  write_obj(guilds_list, () => {
    util.log('  removed guild successfully')
  })
})

client.on('messageCreate', message => {
  client.guilds_list = guilds_list
  _prefix = guilds_list[message.guild.id].prefix
  _helper = new Helper(_prefix)

  if (message.author.id == client.user.id) return
  if (message.content.startsWith(_prefix) || message.content.startsWith(default_prefix)) {
    message.content = message.content.replace(_prefix, "").replace(default_prefix, "").trim().toLowerCase();

    const command = message.content.split(' ').shift()
    let disabled_list = client.guilds_list[message.guild.id].disabled[message.channel.id]
    if (disabled_list && disabled_list.indexOf(command) != -1) {
      _helper.log(message, `permissions error in command ${command}`)
    } else {
      if (command in commands) {
        commands[command](message, client, _helper)
      } else {
        _helper.log(message, `malformed command used`)
      }
    }
  }
})

client.connect()

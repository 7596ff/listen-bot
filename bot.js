const Eris = require('eris')
const config = require('./json/config.json')
const client = new Eris(config.token, {
  "maxShards": config.shard_count, 
  "disableEvents": {
    "TYPING_START": true
  }
})
const schedule = require('node-schedule')

const util = require('util')
const fs = require('fs')

const default_prefix = "--"

var guilds_list = require('./json/guilds.json')
var commands = {}
client.all_usage = require('./json/usage.json')
client.usage = {
  "all": 0
}

for (cmd of require('./consts').cmdlist) {
  commands[cmd] = require(`./commands/${cmd}`)
  client.usage[cmd] = 0
  client.all_usage[cmd] = isNaN(client.all_usage[cmd]) ? 0 : client.all_usage[cmd]
}

function Helper(prefix) {
  this.prefix = prefix
  this.log = (message, text) => {
    require('util').log(`${message.channel.guild.name}/${message.channel.name}: ${text}`)
  }
  this.error = text => {
    return `:octagonal_sign: ${text}`
  }
}

function write_obj(object_to, callback) {
  fs.writeFile('./json/guilds.json', JSON.stringify(object_to), err => {
    if (err) util.log(err)
    callback();
  })
}

var sched = schedule.scheduleJob('*/10 * * * *', () => {
  fs.writeFileSync('./json/usage.json', JSON.stringify(client.all_usage), (err) => {
    if (err) util.log(err)
  })
})

process.on('exit', (code) => {
  util.log(`Exiting with code ${code}`)
  fs.writeFileSync('./json/usage.json', JSON.stringify(client.all_usage))
})

client.on('ready', () => {
  util.log('listen-bot ready.')
  client.shards.forEach(shard => {
    shard.editStatus("online", {"name": `try ${default_prefix}help [shard ${shard.id + 1}/${client.shards.size}]`})
  })
})

client.on('guildCreate', guild => {
  util.log(`${guild.id}/${guild.name}: joined guild on shard ${guild.shard.id}`)

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
  if (!message.channel.guild) return

  client.guilds_list = guilds_list
  _prefix = guilds_list[message.channel.guild.id].prefix
  _helper = new Helper(_prefix)

  if (message.author.id == client.user.id) return
  if (message.content.startsWith(_prefix) || message.content.startsWith(default_prefix)) {
    message.content = message.content.replace(_prefix, "").replace(default_prefix, "").trim()

    const command = message.content.split(' ').shift()
    let disabled_list = client.guilds_list[message.channel.guild.id].disabled[message.channel.id]
    if (disabled_list && disabled_list.indexOf(command) != -1) {
      _helper.log(message, `permissions error in command ${command}`)
    } else {
      if (command in commands) {
        commands[command](message, client, _helper)
        client.usage['all'] += 1
        client.usage[command] += 1
        client.all_usage['all'] += 1
        client.all_usage[command] += 1
        
      } else {
        _helper.log(message, `malformed command used`)
      }
    }
  }
})

client.connect()

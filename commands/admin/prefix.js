const fs = require('fs')

function write_obj(guilds_list, message, helper) {
    fs.writeFile('./json/guilds.json', JSON.stringify(guilds_list), (err) => {
        if (err) console.log(err)
        helper.log(message, '  wrote guilds list object successfully')
    }) 
}

module.exports = (message, client, helper) => {
    if (message.content) {
        client.guilds_list[message.channel.guild.id].prefix = message.content.split(' ')[0]
        write_obj(client.guilds_list, message, helper)
        client.createMessage(message.channel.id, `:ok_hand: prefix set to \`${client.guilds_list[message.channel.guild.id].prefix}\``)
        helper.log(message, 'changed guild prefix')
    }
}

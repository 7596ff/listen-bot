module.exports = (message, client, helper) => {
    let shardinfolist = [`\`\`\`Shards: ${client.shards.size}`]
    let shardmap = new Array(client.shards.size).fill(0)
    client.guilds.forEach(guild => {
        shardmap[guild.shard.id] += guild.members.size
    })
    client.shards.forEach(shard => {
        shardinfolist.push(`Shard ${shard.id}: ${shard.guildCount} guilds, ${shardmap[shard.id]} users`)
    })
    
    client.createMessage(message.channel.id, shardinfolist.join('\n') + "```")
}

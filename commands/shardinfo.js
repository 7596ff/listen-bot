module.exports = (message, client, helper) => {
    let shard_info_list = [`\`\`\`groovy\nShards: ${client.shards.size}`]
    let users = new Array(client.shards.size).fill(0)
    client.guilds.forEach(guild => {
        users[guild.shard.id] += guild.members.size
    })
    client.shards.forEach(shard => {
        shard_info_list.push(`Shard ${shard.id}: ${shard.guildCount} guilds, ${users[shard.id]} users, ${shard.latency} ms`)
    })
    client.createMessage(message.channel.id, {
        "content": `I am shard ${message.channel.guild.shard.id + 1} of ${client.shards.size}.`, 
        "embed": {"description": `${shard_info_list.join('\n')}${"```"}`}
    })
    helper.log(message, "sent shard info")
}

const shardinfo_helper = require('../util/shardinfo_helper')

module.exports = (message, client, helper) => {
    client.createMessage(message.channel.id, {
        "content": `I am shard ${message.channel.guild.shard.id + 1} of ${client.shards.size}.`, 
        "embed": {"description": `${shardinfo_helper(client)}`}
    }).then(new_message => {
        helper.log(message, "sent shard info")
    }).catch(err => helper.handle(message, err))
}

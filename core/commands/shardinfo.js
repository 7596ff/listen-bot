module.exports = (message, client, helper) => {
    message.channel.createMessage({
        "content": `I am shard ${message.channel.guild.shard.id + 1} of ${client.shards.size}.`, 
        "embed": {"description": `${client.core.templates.shardinfo(client)}`}
    }).then(() => {
        helper.log(message, "sent shard info");
    }).catch(err => helper.handle(message, err));
};

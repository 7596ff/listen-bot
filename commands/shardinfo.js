const shardinfo_helper = require("../util/shardinfo_helper");

module.exports = (message, client, helper) => {
    message.channel.createMessage({
        "content": `I am shard ${message.channel.guild.shard.id + 1} of ${client.shards.size}.`, 
        "embed": {"description": `${shardinfo_helper(client)}`}
    }).then(() => {
        helper.log(message, "sent shard info");
    }).catch(err => helper.handle(message, err));
};

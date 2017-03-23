module.exports = (message, client, helper) => {
    message.channel.createMessage(`:ping_pong: Shard latency: \`${message.channel.guild.shard.latency} ms\``).catch(err => helper.handle(message, err))
};

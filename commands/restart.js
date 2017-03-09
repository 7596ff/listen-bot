module.exports = (message, client, helper) => {
    if (message.author.id != client.config.owner) return;

    let tasks = [];

    client.shards.forEach(shard => {
        tasks.push(shard.editStatus("invisible"));
    });

    client.trivia.channels.forEach(channel => {
        tasks.push(client.createMessage(channel, "The bot is going down for an update. Wait a few seconds and type `--trivia start` again. Sorry for the inconvenience!"));
    });

    Promise.all(tasks).then(() => {
        helper.log(message, `${client.shards.size} invised, ${tasks.length - client.shards.size} trivia games shut down`);
        helper.log(message, `${tasks.length} tasks complete, restarting`);
        require("child_process").spawn("./update.sh");
    });
};

module.exports = (message, client, helper) => {
    if (message.author.id != client.config.owner) return;

    tasks = [];

    client.shards.forEach(shard => {
        tasks.push(shard.editStatus("invisible"));
    });

    client.trivia.channels.forEach(channel => {
        tasks.push(client.createMessage(channel, "The bot is going down for a restart. Wait a few seconds and type `--trivia start` again. Sorry for the inconvenience!"));
    });

    Promise.all(tasks).then(() => {
        require("child_process").spawn("./update.sh");
    });
};

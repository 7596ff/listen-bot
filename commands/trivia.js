module.exports = (message, client, helper) => {
    const command = message.content.split(" ").slice(1)[0];
    console.log(command)

    if (command == "start" && message.gcfg.trivia == message.channel.id) {
        client.trivia.init(client, message.channel.id);
    }
};

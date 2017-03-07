module.exports = (message, client, helper) => {
    const command = message.content.split(" ").slice(1)[0];

    if (command == "start" && message.gcfg.trivia == message.channel.id) {
        client.trivia.init(client, message.channel.id);
    }

    if (command == "stop") {
        if (client.trivia.channels.includes(message.gcfg.trivia)) client.trivia.channels.splice(client.trivia.channels.indexOf(message.gcfg.trivia), 1);
        message.channel.createMessage(":ok_hand: Trivia stopped.");
    }
};

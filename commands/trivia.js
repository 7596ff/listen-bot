module.exports = (message, client, helper) => {
    const command = message.content.split(" ").slice(1)[0];

    switch (command) {
    case "start":
        if (message.gcfg.trivia == message.channel.id) {
            client.trivia.init(client, message.channel.id);
        } else if (message.gcfg.trivia != 0 && message.gcfg.trivia != message.channel.id) {
            message.channel.createMessage(`Try this command in the trivia channel! <#${message.gcfg.trivia}>`);
        } else {
            message.channel.createMessage(`This server does not have a desginated trivia channel! Try \`${message.gcfg.prefix}help admin trivia\`.`);
        }
        break;
    case "stop":
        // if (!message.member.permission.has("manageMessages")) break;
        if (client.trivia.channels.includes(message.gcfg.trivia)) client.trivia.channels.splice(client.trivia.channels.indexOf(message.gcfg.trivia), 1);
        message.channel.createMessage(":ok_hand: Trivia stopped.").catch(err => helper.handle(message, err));
        break;
    }
};

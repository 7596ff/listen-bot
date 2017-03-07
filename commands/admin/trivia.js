const help = require("../help");

function edit_trivia(pg, channel, message, client, helper) {
    if (client.trivia.channels.includes(message.gcfg.trivia)) client.trivia.channels.splice(client.trivia.channels.indexOf(message.gcfg.trivia), 1);

    pg.query({
        "text": "UPDATE public.guilds SET trivia = $1 WHERE id = $2",
        "values": [channel || 0, message.channel.guild.id]
    }).then(() => {
        let msg = channel ? `enabled in channel <#${channel}>.` : "disabled.";
        message.channel.createMessage(`:ok_hand: Trivia ${msg}`).then(() => {
            helper.log(message, `changed trivia channel to ${channel || "none"}`);
        }).catch(err => helper.handle(message, err));
    }).catch(err => {
        helper.log(message, "something went wrong with updating trivia channel");
        helper.log(message, err);
    });
}

module.exports = (message, client, helper) => {
    const split_content = message.content.split(" ");
    switch(split_content[0]) {
    case "channel":
        if (message.channelMentions.length > 0) {
            edit_trivia(client.pg, message.channelMentions[0], message, client, helper);
        } else if (split_content.slice(1).join(" ").trim() == "here") {
            edit_trivia(client.pg, message.channel.id, message, client, helper);
        } else if (split_content.slice(1).join(" ").trim() == "none") {
            if (client.trivia.channels.includes(message.gcfg.trivia)) client.trivia.channels.splice(client.trivia.channels.indexOf(message.gcfg.trivia), 1);
            edit_trivia(client.pg, null, message, client, helper);
        }
        break;
    default:
        message.content = "help admin trivia";
        help(message, client, helper);
        break;
    }
};

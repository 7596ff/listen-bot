module.exports = (message, client, helper) => {
    let mike = client.core.json.ixmike;
    message.channel.createMessage(mike[Math.floor(Math.random() * mike.length)]).catch(err => helper.handle(err)).then((msg) => {
        if (msg.channel.guild.id == "137589613312081920") msg.addReaction("ixmikeW:256896118380691466");
    });
};

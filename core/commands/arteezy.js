module.exports = (message, client, helper) => {
    let arteezy = client.core.json.arteezy;
    message.channel.createMessage(arteezy[Math.floor(Math.random() * arteezy.length)]).catch(err => helper.handle(err)).then((msg) => {
        if (msg.channel.guild.id == "137589613312081920") msg.addReaction("rtzW:302222677991620608");
    });
};

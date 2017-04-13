module.exports = (message, client, helper) => {
    let envy = client.core.json.envy;
    message.channel.createMessage(envy[Math.floor(Math.random() * envy.length)]).catch(err => helper.handle(err)).then((msg) => {
        if (msg.channel.guild.id == "137589613312081920") msg.addReaction("jackyW:256527304576991243");
    });
};

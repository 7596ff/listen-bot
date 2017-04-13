module.exports = (message, client, helper) => {
    let envy = client.core.json.envy;
    message.channel.createMessage(envy[Math.floor(Math.random() * envy.length)]).catch(err => helper.handle(err));
};

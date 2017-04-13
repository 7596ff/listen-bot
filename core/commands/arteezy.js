module.exports = (message, client, helper) => {
    let arteezy = client.core.json.arteezy;
    message.channel.createMessage(arteezy[Math.floor(Math.random() * arteezy.length)]).catch(err => helper.handle(err));
};

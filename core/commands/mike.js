module.exports = (message, client, helper) => {
    let mike = client.core.json.ixmike;
    message.channel.createMessage(mike[Math.floor(Math.random() * mike.length)]).catch(err => helper.handle(err));
};

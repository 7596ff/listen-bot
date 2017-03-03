module.exports = (message, client, helper) => {
    message.channel.createMessage(`https://discordapp.com/oauth2/authorize?permissions=${client.config.permissions}&scope=bot&client_id=${client.user.id}`).catch(err => helper.handle(message, err));
};

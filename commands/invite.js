const invite = require("../json/config.json").url_invite;

module.exports = (message, client, helper) => {
    message.channel.createMessage(invite).catch(err => helper.handle(message, err));
};

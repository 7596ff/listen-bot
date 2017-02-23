const invite = require("../json/config.json").url_invite;

module.exports = (message) => {
    message.channel.createMessage(invite).catch(err => helper.handle(message, err));
};

const invite = require("../json/config.json").url_invite;

module.exports = (message) => {
    message.channel.createMessage(invite);
};

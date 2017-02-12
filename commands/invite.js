module.exports = (message) => {
    message.channel.createMessage(require("../json/config.json").url_invite);
};

const mike = require("../json/ixmike.json");

module.exports = (message, client, helper) => {
    message.channel.createMessage(mike[Math.floor(Math.random() * mike.length)]).catch(err => helper.handle(err));
};

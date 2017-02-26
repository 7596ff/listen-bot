const stats_helper = require("../util/stats_helper");

module.exports = (message, client, helper) => {
    stats_helper(client).then(embed => {
        message.channel.createMessage({
            "embed": embed
        }).then(() => {
            helper.log(message, "sent stats");
        }).catch(err => helper.handle(message, err));
    });
};

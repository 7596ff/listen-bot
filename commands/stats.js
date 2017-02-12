module.exports = (message, client, helper) => {
    message.channel.createMessage({
        "embed": require("../util/stats_helper")(client)
    }).then(() => {
        helper.log(message, "sent stats");
    }).catch(err => helper.handle(message, err));
};

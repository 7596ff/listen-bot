const history_with = require("./history/with");
const history_as = require("./history/as");
const eat = require("../util/eat");

async function history(message, client, helper) {
    let response = await eat(message, { 
        "with": "member",
        "as": "string",
        "of": "member"
    });

    if (response.with && response.as) {
        message.channel.createMessage("Invalid syntax.").catch(err => helper.handle(message, err));
        return;
    }
    
    try {
        await message.channel.sendTyping();
    } catch (err) {
        helper.handle(message, err);
    }

    if (response.with) history_with(message, client, helper, response.with);
    if (response.as) history_as(message, client, helper, response.as, response.of ? client.users.get(response.of[0]) : false);
}

module.exports = history;
async function history(message, client, helper) {
    let response = await client.core.util.eat(message, { 
        "with": "member",
        "as": "string",
        "of": "member"
    });

    if ((response.with && response.as) || (!response.with && !response.as && !response.of)) {
        message.channel.createMessage("Invalid syntax.").catch(err => helper.handle(message, err));
        return;
    }

    try {
        await message.channel.sendTyping();
    } catch (err) {
        helper.handle(message, err);
    }

    if (response.with) client.core.commands._history.with(message, client, helper, response.with);
    if (response.as) client.core.commands._history.as(message, client, helper, response.as, response.of ? client.users.get(response.of[0]) : false);
}

module.exports = history;

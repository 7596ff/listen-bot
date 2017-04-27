const types = ["player"];
const map = types.map((type) => `\`${type}\``).join(", ");

async function unsub(message, client, helper) {
    let locale = client.core.locale[message.gcfg.locale];

    if (!message.member.permission.has("manageMessages")) {
        message.channel.createMessage("Manage Messages is required to create and remove subscriptions.").catch((err) => helper.handle(message, err));
    }

    // interactive unsub
}

module.exports = unsub;

const util = require("util");

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    let acc_id = options[1];

    if (!client.steam_client.connected) {
        message.channel.createMessage("Steam is down or registering is disabled at the moment, sorry about that.");
        return;
    }

    if (!acc_id) {
        message.channel.createMessage("Please supply an account ID!");
        return;
    }

    if (acc_id.match("dotabuff") || acc_id.match("opendota")) {
        let url = acc_id.split("/");
        acc_id = url[url.length - 1];
    }

    if (isNaN(acc_id)) {
        message.channel.createMessage("I couldn't find an account ID in your message!");
        return;
    }

    helper.log(message, `register: ${acc_id}`);

    client.mika.getPlayer(acc_id).then(res => {
        if (res.profile.steamid) {
            let rand = require("randomstring").generate(6);
            client.redis.set(`register:${res.profile.steamid}`, `${rand}:${message.author.id}`, (err) => {
                if (err) helper.log(message, err);
                client.redis.expire(`register:${res.profile.steamid}`, 900);
                client.steam_friends.addFriend(res.profile.steamid);
                message.author.getDMChannel().then(dm_channel => {
                    dm_channel.createMessage([
                        "Thanks for registering with listen-bot!",
                        "Please check your steam friend requests. You should recieve a request from a bot with the same name as me.",
                        `On acceptance, it will prompt you for a code, please send it this: \`${rand}\``,
                        "This code will time out in 10 minutes."
                    ].join("\n")).then(() => {
                        util.log("  sent friend req, awaiting code");
                    }).catch(err => {
                        helper.handle(message, err);
                    });
                });
            });
        } else {
            client.createMessage("I couldn't find a steam ID associated with this user!");
        }
    }).catch(err => {
        helper.log(message, "something went wrong with mika");
        helper.log(message, err);
    });
};

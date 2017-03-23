const randomstring = require("randomstring");

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    let url = options[1];

    if (!client.steam_connected) {
        message.channel.createMessage("Steam is down or registering is disabled at the moment, sorry about that.").catch(err => helper.handle(message, err));
        return;
    }

    if (!url) {
        message.channel.createMessage("Please give me something to register!").catch(err => helper.handle(message, err));
        return;
    }

    client.core.util.resolve_steam_url(client, url).then(acc_id => {
        helper.log(message, `register: ${acc_id}`);

        client.mika.getPlayer(acc_id).then(res => {
            if (!res.profile) {
                message.channel.createMessage("This steam account is private! I can't register it!").catch(err => helper.handle(message, err));
                helper.log(message, "  failed on private steam account");
                return;
            }

            if (res.profile.steamid) {
                let rand = randomstring.generate(6);
                client.redis.set(`register:${res.profile.steamid}`, `${rand}:${message.author.id}`, (err) => {
                    if (err) helper.log(message, err);
                    client.redis.expire(`register:${res.profile.steamid}`, 900);
                    client.redis.publish("discord", JSON.stringify({
                        "code": 3,
                        "message": "registering a user",
                        "steam_id": res.profile.steamid
                    }));
                    message.author.getDMChannel().then(dm_channel => {
                        dm_channel.createMessage([
                            "Thanks for registering with listen-bot!",
                            "Please check your steam friend requests. You should recieve a request from me.",
                            `On acceptance, I will prompt you for a code, please send me this: \`${rand}\``,
                            "This code is case sensitive and will expire in 10 minutes.",
                            "",
                            `If you didn't get a friend request, try sending me a request as well: <${client.config.steam_acc_url}>`
                        ].join("\n")).then(() => {
                            helper.log(message, "sent friend req, awaiting code");
                        }).catch(err => helper.handle(message, err));
                    });
                });
            } else {
                client.createMessage("I couldn't find a steam ID associated with this user!").catch(err => helper.handle(message, err));
            }
        }).catch(err => {
            helper.log(message, "something went wrong with mika");
            helper.log(message, err);
        });
    }).catch(err => {
        if (err == "nosteam") {
            message.channel.createMessage("I couldn't find a steam profile in that message!").catch(err => helper.handle(message, err));
        } else if (err.success == 42) {
            message.channel.createMessage("I couldn't find a steam profile associated with that link!").catch(err => helper.handle(message, err));

        } else {
            message.channel.createMessage("Something went wrong resolving this profile.").catch(err => helper.handle(message, err));
            helper.log(message, "something went wrong resolving a url");
            helper.log(message, err);
        }
    });
};

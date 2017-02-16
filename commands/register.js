const util = require("util");
const Bignumber = require("bignumber.js");
const needle = require("needle");

const query_string = require("../util/query_string");
const resolve_steam_url = require("../util/resolve_steam_url");

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    let url = options[1];

    if (!client.steam_client.connected) {
        message.channel.createMessage("Steam is down or registering is disabled at the moment, sorry about that.");
        return;
    }

    if (!url) {
        message.channel.createMessage("Please give me something to register!");
        return;
    }

    resolve_steam_url(url).then(acc_id => {
        helper.log(message, `register: ${acc_id}`);

        client.mika.getPlayer(acc_id).then(res => {
            if (!res.profile) {
                message.channel.createMessage("This steam account is private! I can't register it!");
                helper.log(message, "  failed on private steam account");
                return;
            }

            if (res.profile.steamid) {
                let rand = require("randomstring").generate(6);
                client.redis.set(`register:${res.profile.steamid}`, `${rand}:${message.author.id}`, (err) => {
                    if (err) helper.log(message, err);
                    client.redis.expire(`register:${res.profile.steamid}`, 900);
                    client.steam_friends.addFriend(res.profile.steamid);
                    message.author.getDMChannel().then(dm_channel => {
                        dm_channel.createMessage([
                            "Thanks for registering with listen-bot!",
                            "Please check your steam friend requests. You should recieve a request from me.",
                            `On acceptance, I will prompt you for a code, please send me this: \`${rand}\``,
                            "This code is case sensitive and will expire in 10 minutes.",
                            "",
                            `If you didn't get a friend request, try sending me a request as well: <${client.config.steam_acc_url}>`
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
    }).catch(err => {
        if (err == "nosteam") {
            message.channel.createMessage("I couldn't find a steam profile in that message!");
        } else {
            util.log("something went wrong resolving a url");
            util.log(err);
        }
    });
};

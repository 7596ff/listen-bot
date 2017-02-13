const util = require("util");
const Bignumber = require("bignumber.js");
const needle = require("needle");

const query_string = require("../util/query_string");

function resolve_url(url, steam_key) {
    return new Promise((resolve, reject) => {
        if (url.endsWith("/")) url = url.slice(0, -1);

        if (url.match("dotabuff.com/players") || url.match("opendota.com/players")) {
            url = url.split("/");
            resolve(url[url.length - 1]);
        }

        if (url.match("steamcommunity.com/")) {
            if (url.match("/profiles/")) {
                url = url.split("/");
                url = url[url.length - 1];
                resolve(new Bignumber(url).minus("76561197960265728"));
            } 

            if (url.match("/id/")) {
                url = url.split("/");
                url = url[url.length - 1];
                let options = {
                    "key": steam_key,
                    "vanityurl": url
                };

                needle.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/${query_string(options)}`, (err, response) => {
                    let body = response.body.response; // thanks gabe
                    if (body.success == 1) {
                        resolve(new Bignumber(body.steamid).minus("76561197960265728"));
                    } else {
                        reject(body);
                    }
                });
            } else {
                reject("nosteam");
            }
        }
    });
}

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

    resolve_url(url, client.config.steam_key).then(acc_id => {
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
                            "Please check your steam friend requests. You should recieve a request from me.",
                            `On acceptance, I will prompt you for a code, please send me this: \`${rand}\``,
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
    }).catch(err => {
        if (err == "nosteam") {
            message.channel.createMessage("I couldn't find a steam profile in that message!");
        } else {
            util.log("something went wrong resolving a url");
            util.log(err);
        }
    });
};

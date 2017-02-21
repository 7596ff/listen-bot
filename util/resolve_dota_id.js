const resolve_user = require("./resolve_user");
const search_members = require("./search_members");

function handle(reject, err, username, prefix) {
    if (err == "nouser") {
        let fmt = username ? `${username} has not` : "You haven't";
        reject({
            "text": `${fmt} registered with me yet! Try \`${prefix}help register\`.`,
            "log": "a user didn't register"
        });
    } else {
        reject({
            "text": "Something went wrong selecting this user from the database.",
            "err": err
        });
    }
}

module.exports = (message, from_discord) => {
    return new Promise((resolve, reject) => {
        if (from_discord) {
            let inguild = message.channel.guild.members.find(member => member.id == from_discord);
            if (inguild) {
                resolve_user(message._client, inguild.id).then(acc_id => {
                    resolve(acc_id);
                }).catch(err => {
                    handle(reject, err, inguild.username, message.gcfg.prefix);
                });
            }
        } else {
            if (message.mentions.length > 0) {
                resolve_user(message._client, message.mentions[0].id).then(acc_id => {
                    resolve(acc_id);
                }).catch(err => {
                    handle(reject, err, message.mentions[0].username, message.gcfg.prefix);
                });
            } else {
                let options = message.content.split(" ").slice(1).join(" ");
                let inguild = message.channel.guild.members.find(member => (member.nick || member.username) == options);

                if (inguild) {
                    resolve_user(message._client, inguild.id).then(acc_id => {
                        resolve(acc_id);
                    }).catch(err => {
                        handle(reject, err, inguild.username, message.gcfg.prefix);
                    });
                } else {
                    if (options.length > 0) {
                        let acc_id = options;

                        if (acc_id.match("dotabuff") || acc_id.match("opendota")) {
                            let url = acc_id.split("/");
                            acc_id = url[url.length - 1];
                        }

                        if (isNaN(acc_id)) {
                            reject({
                                "text": "I couldn't find an account ID in your message!",
                                "log": "no account id"
                            });
                        }

                        resolve(acc_id);
                    } else {
                        resolve_user(message._client, message.author.id).then(acc_id => {
                            resolve(acc_id);
                        }).catch(err => {
                            handle(reject, err, null, message.gcfg.prefix);
                        });
                    }
                }
            }
        }
    });
};

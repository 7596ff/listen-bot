const matchinfo = require("./matchinfo");
const resolve_user = require("../util/resolve_user");

function send_message(message, client, helper, acc_id) {
    message.channel.sendTyping().then(() => {
        client.redis.get(`lastmatch:${acc_id}`, (err, res) => {
            if (err) helper.log(message, err);
            if (res) {
                message.content = `matchinfo ${res}`;
                matchinfo(message, client, helper);
            } else {
                client.mika.getPlayerMatches(acc_id, {
                    "limit": "1"
                }).then(match => {
                    let match_id = match[0].match_id;
                    message.content = `matchinfo ${match_id}`;
                    matchinfo(message, client, helper);
                    client.redis.set(`lastmatch:${acc_id}`, match_id, (err) => {
                        if (err) helper.log(err);
                        client.redis.expire(`lastmatch:${acc_id}`, 1800);
                    });
                });
            }
        });

    });
}

module.exports = (message, client, helper) => {
    if (message.mentions.length > 0) {
        resolve_user(client, message.mentions[0].id).then(acc_id => {
            send_message(message, client, helper, acc_id);
        }).catch(err => {
            if (err == "nouser") {
                message.channel.createMessage(`That user has not registered with me yet! Try \`${helper.prefix}help register\`.`);
            } else {
                message.channel.createMessage("Something went wrong selecting this user from the database.");
                helper.log(message, err);
            }
        });
    } else {
        let options = message.content.split(" ");
        options.shift();
        let acc_id = options[0];
        let name = options.join(" ");
        let inguild = message.channel.guild.members.find(member => (member.nick || member.username) == name);
        let inclient = client.users.find(user => user.username == name);

        if (inguild) {
            resolve_user(client, inguild.id).then(acc_id => {
                send_message(message, client, helper, acc_id);
            }).catch(err => {
                if (err == "nouser") {
                    message.channel.createMessage(`That user has not registered with me yet! Try \`${helper.prefix}help register\`.`);
                } else {
                    message.channel.createMessage("Something went wrong selecting this user from the database.");
                    helper.log(message, err);
                }
            });
            return;
        }

        if (inclient) {
            resolve_user(client, inclient.id).then(acc_id => {
                send_message(message, client, helper, acc_id);
            }).catch(err => {
                if (err == "nouser") {
                    message.channel.createMessage(`That user has not registered with me yet! Try \`${helper.prefix}help register\`.`);
                } else {
                    message.channel.createMessage("Something went wrong selecting this user from the database.");
                    helper.log(message, err);
                }
            });
            return;
        }

        if (!acc_id) {
            resolve_user(client, message.author.id).then(acc_id => {
                send_message(message, client, helper, acc_id);
            }).catch(err => {
                if (err == "nouser") {
                    message.channel.createMessage(`You have not registered with me yet! Try \`${helper.prefix}help register\`.`);
                } else {
                    message.channel.createMessage("Something went wrong selecting this user from the database.");
                    helper.log(message, err);
                }
            });
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

        send_message(message, client, helper, acc_id);
    }
};

const matchinfo = require("./matchinfo");
const resolve_dota_id = require("../util/resolve_dota_id");

function send_message(message, client, helper, acc_id) {

}

module.exports = (message, client, helper) => {
    message.channel.sendTyping().then(() => {
        let check = message.content.split(" ")[1];
        if (check && check == "with") {
            let queries = [resolve_dota_id(message, message.author.id)];
            for (ping in message.mentions) {
                queries.push(resolve_dota_id(message, message.mentions[ping].id));
            }

            Promise.all(queries).then(results => {
                helper.log(message, `lastmatch: ${results.join(", ")}`);
                client.mika.getPlayerMatches(results[0], {
                    "limit": 1,
                    "included_account_id": results.slice(1)
                }).then(match => {
                    if (match) {
                        let match_id = match[0].match_id;
                        message.content = `matchinfo ${match_id}`;
                        matchinfo(message, client, helper);
                    }
                }).catch(err => {
                    helper.log(message, err);
                    message.channel.createMessage("Something went wrong.");
                });
            }).catch(err => {
                if (err.err) {
                    message.channel.createMessage(err.text);
                    helper.log(message, err.text);
                    helper.log(message, err.err);
                } else {
                    message.channel.createMessage(err.text);
                }
            })
        } else {
            resolve_dota_id(message).then(acc_id => {
                helper.log(message, `lastmatch: ${acc_id}`);

                client.redis.get(`lastmatch:${acc_id}`, (err, res) => {
                    if (err) helper.log(message, err);
                    if (res) {
                        message.content = `matchinfo ${res}`;
                        matchinfo(message, client, helper);
                    } else {
                        client.mika.getPlayerMatches(acc_id, {
                            "limit": "1"
                        }).then(match => {
                            if (match) {
                                let match_id = match[0].match_id;
                                message.content = `matchinfo ${match_id}`;
                                matchinfo(message, client, helper);
                                client.redis.set(`lastmatch:${acc_id}`, match_id, (err) => {
                                    if (err) helper.log(err);
                                    client.redis.expire(`lastmatch:${acc_id}`, 1800);
                                });
                            } else {
                                message.channel.createMessage("Couldn't find this player on Opendota!");
                            }
                        });
                    }
                });
            }).catch(err => {
                console.log(err)
                if (err.err) {
                    message.channel.createMessage(err.text);
                    helper.log(message, err.text);
                    helper.log(message, err.err);
                } else if (err) {
                    message.channel.createMessage(err);
                } else {
                    message.channel.createMessage("Something went wrong.");
                }
            });
        }
    });
};

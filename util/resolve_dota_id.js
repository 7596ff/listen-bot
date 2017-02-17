const resolve_user = require("./resolve_user");

module.exports = (message, from_discord) => {
    return new Promise((resolve, reject) => {
        if (from_discord) {
            let inclient = message._client.users.find(user => user.id == from_discord);
            if (inclient) {
                resolve_user(message._client, inclient.id).then(acc_id => {
                    resolve(acc_id);
                }).catch(err => {
                    if (err == "nouser") {
                        reject({
                            "text": `${inclient.username} has not registered with me yet! Try \`${message.gcfg.prefix}help register\`.`
                        });
                    } else {
                        reject({
                            "text": "Something went wrong selecting this user from the database.",
                            "err": err
                        });
                    }
                });
            }
        } else {
            if (message.mentions.length > 0) {
                resolve_user(message._client, message.mentions[0].id).then(acc_id => {
                    resolve(acc_id);
                }).catch(err => {
                    if (err == "nouser") {
                        reject({
                            "text": `That user has not registered with me yet! Try \`${message.gcfg.prefix}help register\`.`
                        });
                    } else {
                        reject({
                            "text": "Something went wrong selecting this user from the database."
                        });
                    }
                });
            } else {
                let options = message.content.split(" ");
                options.shift();
                let acc_id = options[0];
                let name = options.join(" ");
                let inguild = message.channel.guild.members.find(member => (member.nick || member.username) == name);
                let inclient = message._client.users.find(user => user.username == name);

                if (inclient || inguild) {
                    if (inguild) {
                        resolve_user(message._client, inguild.id).then(acc_id => {
                            resolve(acc_id);
                        }).catch(err => {
                            if (err == "nouser") {
                                reject({
                                    "text": `That user has not registered with me yet! Try \`${message.gcfg.prefix}help register\`.`
                                });
                            } else {
                                reject({
                                    "text": "Something went wrong selecting this user from the database.",
                                    "err": err
                                });
                            }
                        });
                    }

                    if (inclient) {
                        resolve_user(message._client, inclient.id).then(acc_id => {
                            resolve(acc_id);
                        }).catch(err => {
                            if (err == "nouser") {
                                reject({
                                    "text": `That user has not registered with me yet! Try \`${message.gcfg.prefix}help register\`.`
                                });
                            } else {
                                reject({
                                    "text": "Something went wrong selecting this user from the database.",
                                    "err": err
                                });
                            }
                        });
                    }
                } else {
                    if (acc_id) {
                        if (acc_id.match("dotabuff") || acc_id.match("opendota")) {
                            let url = acc_id.split("/");
                            acc_id = url[url.length - 1];
                        }

                        if (isNaN(acc_id)) {
                            reject({
                                "text": "I couldn't find an account ID in your message!"
                            });
                        }

                        resolve(acc_id);
                    } else {
                        resolve_user(message._client, message.author.id).then(acc_id => {
                            resolve(acc_id);
                        }).catch(err => {
                            if (err == "nouser") {
                                reject({
                                    "text": `You have not registered with me yet! Try \`${message.gcfg.prefix}help register\`.`
                                });
                            } else {
                                reject({
                                    "text": "Something went wrong selecting this user from the database.",
                                    "err": err
                                });
                            }
                        });
                    }
                }
            }
        }
    });
};

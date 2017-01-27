const fs = require("fs");

function write_obj(guilds_list, message, helper) {
    fs.writeFile("./json/guilds.json", JSON.stringify(guilds_list), (err) => {
        if (err) {
            helper.log(message, err);
        } else {
            helper.log(message, "  wrote guilds list object successfully");
        }
    });
}

module.exports = (message, client, helper) => {
    if (message.content) {
        let options = message.content.split(" ");
        if (["channel", "member"].indexOf(options[0]) != -1 && !isNaN(options[1])) {
            client.guilds_list[message.channel.guild.id][`${options[0]}_limit`] = options[1] * 1000;
            write_obj(client.guilds_list, message, helper);
            client.createMessage(message.channel.id, `:k_hand: Set ${options[0]} limit to ${options[1]} seconds.`).then(() => {
                helper.log(message, "set new cooldowns");
            }).catch(err => helper.handle(message, err));
        }
    }
};

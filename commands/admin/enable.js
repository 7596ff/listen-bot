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
        let to_disable = message.content.split(" ");
        let _enabled = [];
        for (let cmd of to_disable) {
            if (client.guilds_list[message.channel.guild.id].disabled[message.channel.id]
                && client.guilds_list[message.channel.guild.id].disabled[message.channel.id].indexOf(cmd) != -1) {
                if (require("../../util/consts.json").cmdlist.indexOf(cmd) != -1) {
                    let index = client.guilds_list[message.channel.guild.id].disabled[message.channel.id].indexOf(cmd);
                    client.guilds_list[message.channel.guild.id].disabled[message.channel.id].splice(index, 1);
                    _enabled.push(cmd);
                }
            }
        }

        if (_enabled.length > 0) {
            write_obj(client.guilds_list, message, helper);
            client.createMessage(message.channel.id, `:ok_hand: enabled ${_enabled.join(", ")}`).then(() => {
                helper.log(message, "enabled some commands");
            }).catch(err => helper.handle(message, err));
        }
    }
};

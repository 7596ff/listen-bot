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
        let newprefix = message.content.replace("\"", "");

        let qstring = [
            "UPDATE public.guilds",
            `SET prefix = '${newprefix}'`,
            `WHERE id = '${message.channel.guild.id}';`
        ];
        client.pg.query(qstring.join(" ")).then(res => {
            client.createMessage(message.channel.id, `:ok_hand: prefix set to \`${newprefix}\``).then(() => {
                helper.log(message, `changed guild prefix to ${newprefix}`);
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, "something went wrong with updating prefix");
            helper.log(message, err);
        });

    }
};

const admin_commands = {
    "disable": require("./admin/disable"),
    "enable": require("./admin/enable"),
    "prefix": require("./admin/prefix"),
    "cooldowns": require("./admin/cooldowns")
};

module.exports = (message, client, helper) => {
    if (message.member.permission.json.manageMessages) {
        let options = message.content.split(" ");
        const command = options.slice(1, options.length)[0];
        message.content = options.slice(2, options.length).join(" ");
        if (command in admin_commands) {
            admin_commands[command](message, client, helper);
        } else {
            helper.log(message, "malformed command used");
        }
    } else {
        helper.log(message, "permissions error");
    }
};

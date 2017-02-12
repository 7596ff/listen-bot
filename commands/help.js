const help_topics = require("../json/help.json");

const help_embed = function (help_obj, prefix) {
    let fields = [];

    if (help_obj.usage) fields.push({
        "name": "Usage",
        "value": `\`${prefix}${help_obj.usage}\``,
        "inline": true
    });

    if (help_obj.example) fields.push({
        "name": "Example",
        "value": `\`${prefix}${help_obj.example}\``,
        "inline": true
    });

    return {
        "author": {
            "name": help_obj.name
        },
        "fields": fields,
        "description": help_obj.text.join("")
    };
};

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    options.shift();
    let specific_topic = options.join(" ");
    if (specific_topic in help_topics) {
        message.channel.createMessage({
            "embed": help_embed(help_topics[specific_topic], helper.prefix)
        }).then(new_message => {
            helper.log(new_message, `Helped with topic ${specific_topic}`);
        }).catch(err => helper.handle(message, err));
    } else {
        let help_list = [];
        for (let topic in help_topics) {
            if (topic.match("admin")) {
                if (message.member.permission.has("manageMessages")) help_list.push(topic);
            } else {
                help_list.push(topic);
            }
        }
        let conditional = specific_topic ? `Help topic not found: \`${specific_topic}\`. ` : "";
        if (conditional != "") helper.log(message, "could not help with " + specific_topic);
        let fmt = help_list.map(topic => `\`${topic}\``).join(" ");
        message.channel.createMessage(`${conditional}List of help topics: ${fmt}`).then(new_message => {
            helper.log(new_message, "helped with all topics");
        }).catch(err => helper.handle(message, err));
    }
};

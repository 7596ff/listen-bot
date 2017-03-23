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
    let help_topics = client.core.json.help;
    let specific_topic = message.content.split(" ").slice(1).join(" ").toLowerCase();

    for (let cat in help_topics) {
        let present = help_topics[cat].find(topic => topic.name == specific_topic);
        if (present) {
            message.channel.createMessage({
                "embed": help_embed(present, message.gcfg.prefix)
            }).then(new_message => {
                helper.log(new_message, `helped with topic ${specific_topic}`);
            }).catch(err => helper.handle(message, err));
            return;
        }
    }

    let help_list = ["List of commands:"];

    if (specific_topic) help_list.splice(0, 0, `Help topic not found: \`${specific_topic}\`.\n`);

    for (let key in help_topics) {
        let fmt = help_topics[key].map(topic => `\`${topic.name}\``);
        if (key == "admin" && message.member.permission.has("manageMessages")) {
            help_list.push(`${key}: ${fmt.join(", ")}`);
        } else if (key != "admin") {
            help_list.push(`${key}: ${fmt.join(", ")}`);
        }
    }

    message.channel.createMessage(help_list.join("\n")).then(new_message => {
        helper.log(new_message, "helped with all topics");
    }).catch(err => helper.handle(message, err));  
};

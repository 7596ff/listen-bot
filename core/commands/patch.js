module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;
    
    let options = message.content.split(" ").slice(1);
  
    for (let arg in options) {
        if (client.core.json.patch.schema.includes(options[arg])) {
            let version = options[arg];
            options.splice(options.indexOf(version), 1);
            client.core.commands._patch.version_hero(message, client, helper, version, options.join(" ").toLowerCase());
            return;
        }
    }
    client.core.commands._patch.hero(message, client, helper, options.join(" "));
};

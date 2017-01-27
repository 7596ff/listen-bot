const patch_list = require("../json/patch.json");

const hero = require("./patch/hero");
const version_hero = require("./patch/version_hero");

module.exports = (message, client, helper) => {
    let options = message.content.toLowerCase().split(" ");
    options.shift();
  
    for (let arg in options) {
        if (patch_list.schema.indexOf(options[arg]) != -1) {
            let version = options[arg];
            options.splice(options.indexOf(version), 1);
            version_hero(message, client, helper, version, options.join(" ").toLowerCase());
            return;
        }
    }
    hero(message, client, helper, options.join(" "));
};

const items = require("../json/items.json");
const item_embed = require("../embeds/item");

const too_short = ["of", "and", "in", "the", "de"];

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    options.shift();

    helper.log(message, `item: ${options.join(" ")}`);

    let result = false;
    let search;
    let conflicts = [];

    loop1: for (let i = 0; i <= options.length; i++) {
        loop2: for (let j = 0; j <= options.length; j++) {
            let term = options.slice(i, j).join(" ").toLowerCase();
            if (i < j) {
                if (too_short.indexOf(term) != -1) break loop2;
                search = items.filter(item => {
                    if (too_short.indexOf(item) != -1) return false;
                    if (item.format_name.toLowerCase().match(term)) return true;
                    if ((item.aliases || []).indexOf(term) != -1) return true;
                    if (item.true_name.split("_").indexOf(term) != -1) return true;
                });

                if (search.length == 1) {
                    result = search[0];
                    break loop1;
                } else if (search.length > 1) {
                    let conf = search.map(item => item.format_name)
                    for (item in conf) conflicts.push(conf[item]);
                }
            }
        }
    }

    if (result && search.length > 0) {
        message.channel.createMessage({
            "embed": item_embed(result)
        }).then(() => {
            helper.log(message, "sent item embed");
        }).catch(err => {
            helper.handle(message, err);
        });
    } else {
        let content = "Couldn't find that item. "
        if (conflicts.length > 1) {
            conflicts = conflicts.filter((item, inc, newlist) => newlist.indexOf(item) === inc);
            content += `Possible conflicts: ${conflicts.join(", ")}`;
        }

        message.channel.createMessage(content).then(new_message => {
            helper.log(message, "sent not found");
            setTimeout(() => {
                new_message.delete();
            }, 10000);
        });
    }
};

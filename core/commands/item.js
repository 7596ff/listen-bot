const too_short = ["of", "and", "in", "the", "de"];

module.exports = (message, client, helper) => {
    if (client.trivia.channels.includes(message.channel.id)) return;
    
    let locale = client.core.locale[message.gcfg.locale].com.item;
    let items = client.core.json.items;
    let item_embed = client.core.embeds.item;

    let options = message.content.toLowerCase().split(" ").slice(1);

    helper.log(message, `item: ${options.join(" ")}`);

    let result = false;
    let search;
    let conflicts = [];

    loop1: for (let i = 0; i <= options.length; i++) {
        loop2: for (let j = 0; j <= options.length; j++) {
            if (i < j) {
                let term = options.slice(i, j).join(" ");
                if (too_short.includes(term)) break loop2;
                
                search = items.filter(item => {
                    if (item.true_name == "sange_and_yasha" & (term.toLowerCase() == "yasha" | term.toLowerCase() == "sange")) return false;
                    if (item.true_name == "sange" && options.join(" ").toLowerCase() == "sange and yasha") return false;
                    if (too_short.includes(item)) return false;
                    if (item.format_name.toLowerCase().match(term) && term.length > 2) return true;
                    if ((item.aliases || []).includes(term)) return true;
                    if (item.true_name.split("_").includes(term)) return true;
                    if (item.format_name.split(" ").map(item => item.charAt(0)).join("").toLowerCase() == term) return true;
                });

                if (search.length == 1) {
                    result = search[0];
                    break loop1;
                } else if (search.length > 1) {
                    let conf = search.map(item => item.format_name);
                    for (let item in conf) conflicts.push(conf[item]);
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
        let content = locale.noitem;
        if (conflicts.length > 1) {
            conflicts = conflicts.filter((item, inc, newlist) => newlist.indexOf(item) === inc);
            content = `${content} ${client.sprintf(locale.conflicts, conflicts.join(", "))}`;
        }

        message.channel.createMessage(content).then(new_message => {
            helper.log(message, "sent not found");
            setTimeout(() => {
                new_message.delete();
            }, 10000);
        }).catch(err => helper.handle(message, err));
    }
};

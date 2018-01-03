const too_short = ["of", "and", "in", "the", "de"];

const items = require("../../json/items");
const itemEmbed = require("../../embeds/item");
const ReactionChooser = require("../../classes/reactionChooser");

async function exec(ctx) {
    let options = ctx.content.toLowerCase().split(" ").slice(1);

    let result = false;
    let search;
    let conflicts = [];

    loop1: for (let i = 0; i <= options.length; i++) {
        loop2: for (let j = 0; j <= options.length; j++) {
            if (i < j) {
                let term = options.slice(i, j).join(" ");
                if (too_short.includes(term)) break loop2;

                search = items.filter((item) => {
                    if (item.name.startsWith("recipe")) return false;
                    if (item.name == "sange_and_yasha" & (term.toLowerCase() == "yasha" | term.toLowerCase() == "sange")) return false;
                    if (item.name == "sange" && options.join(" ").toLowerCase() == "sange and yasha") return false;
                    if (too_short.includes(item)) return false;
                    if (item.dname && item.dname.toLowerCase().match(term) && term.length > 2) return true;
                    //if ((item.aliases || []).includes(term)) return true;
                    if (item.name.split("_").includes(term)) return true;
                    if (item.dname && item.dname.split(" ").map(item => item.charAt(0)).join("").toLowerCase() == term) return true;
                });

                if (search.length == 1) {
                    result = search[0];
                    break loop1;
                } else if (search.length > 1) {
                    conflicts.push(...search);
                }
            }
        }
    }

    if (result && search.length > 0) {
        let embed = itemEmbed(result, items);
        return ctx.embed(embed);
    } else {
        let content = ctx.strings.get("item_not_found");
        let reduced = conflicts.filter((item, inc, newlist) => newlist.indexOf(item) === inc);
        if (reduced.length > 1) {
            let map = reduced.map((item, index) => `${index}\u20e3 ${item.dname}`);
            map.unshift(ctx.strings.get("item_multiple_conflicts"), "");
            let msg = await ctx.embed({
                description: map.join("\n")
            });

            ctx.client.watchers[msg.id] = new ReactionChooser(ctx, msg, reduced.map((conflict) => itemEmbed(conflict, items)));
            return Promise.resolve();
        } else if (reduced.length == 1) {
            let embed = itemEmbed(items.find((item) => item.dname == conflicts[0]), items);
            return ctx.embed(embed);
        }

        return ctx.send(content).then((new_message) => {
            setTimeout(() => {
                new_message.delete();
            }, 10000);
        });
    }
}

module.exports = {
    name: "item",
    category: "static",
    triviaCheat: true,
    exec
};

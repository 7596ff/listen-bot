module.exports = item => {
    let costs = [];
    let desc = [];
    let att = [];

    if (item.mc) costs.push(`<:manacost:273535201337016320> ${item.mc}`);
    if (item.cooldown) costs.push(`<:cooldown:273535146320199680> ${item.cooldown}`);
    if (item.cost) costs.push(`Cost: ${item.cost}`);

    for (let line in item.description) desc.push(item.description[line]);
    if (item.notes) for (let note in item.notes) desc.push(item.notes[note]);

    for (let attr in item.attributes) {
        let split = item.attributes[attr].split(": ");
        if (split.length > 1) {
            split[0] = `**${split[0]}**`;
            att.push(split.join(": "));
        } else {
            att.push(`**${item.attributes[attr]}**`);
        }
    }
    

    return {
        "author": {
            "name": item.format_name,
            "url": `http://dota2.gamepedia.com/${item.format_name.split(" ").join("_")}`,
            "icon_url": `http://cdn.dota2.com/apps/dota2/images/items/${item.true_name}_lg.png`
        },
        "fields": [{
            "name": costs.join("   "),
            "value": att.length > 0 ? att.join("\n") : "Nothing special.",
            "inline": true
        }],
        "description": desc.join("\n"),
        "footer": {
            "text": item.lore ? item.lore.join(" ") : ""
        }
    };
};

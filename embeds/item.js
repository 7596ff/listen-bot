module.exports = item => {
    let costs = [];

    if (item.mc) costs.push(`<:manacost:273535201337016320> ${item.mc}`);
    if (item.cooldown) costs.push(`<:cooldown:273535146320199680> ${item.cooldown}`);
    if (item.cost) costs.push(`Cost: ${item.cost}`);

    if (item.notes) for (note in item.notes) item.description.push(item.notes[note]);

    for (attr in item.attributes) {
        let split = item.attributes[attr].split(": ");
        if (split.length > 1) {
            split[0] = `**${split[0]}**`;
            item.attributes[attr] = split.join(": ");
        } else {
            item.attributes[attr] = `**${item.attributes[attr]}**`;
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
            "value": item.attributes.join("\n"),
            "inline": true
        }],
        "description": item.description.join("\n"),
        "footer": {
            "text": item.lore ? item.lore.join(" ") : ""
        }
    };
};

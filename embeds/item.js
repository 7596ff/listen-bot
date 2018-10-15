function itemEmbed(item, items) {
    let costs = [];
    let desc = [];
    let att = [];

    if (item.mc) costs.push(`<:manacost:273535201337016320> ${item.mc}`);
    if (item.cd) costs.push(`<:cooldown:273535146320199680> ${item.cd}`);
    if (item.cost) costs.push(`<:gold:281572294030131200> ${item.cost}`);

    if (item.desc) desc.push(item.desc);
    if (item.notes) desc.push(item.notes);

    let attributes = item.attrib && item.attrib
        .filter((attrib) => !attrib.header.includes("TOOLTIP"))
        .map((attrib) => {
            if (attrib.footer) {
                return `**${attrib.header}${Array.isArray(attrib.value) ? attrib.value.join(" / ") : attrib.value}** ${attrib.footer}`;
            } else {
                return `**${attrib.header}** ${Array.isArray(attrib.value) ? attrib.value.join(" / ") : attrib.value}`;
            }
        });

    let fields = [{
        name: costs.length ? costs.join("   ") : "\u200b",
        value: attributes ? attributes.join("\n") : "Nothing special.",
        inline: true
    }];

    if (item.created) {
        let comp = item.components.map((component) => items.find((item) => item.name == component));
        fields.push({
            name: "Components",
            value: comp.map((component) => `<:gold:281572294030131200> ${component.cost} - **${component.dname}**`).join("\n"),
            inline: true
        });
    }

    return {
        "author": {
            "name": item.dname,
            "url": `http://dota2.gamepedia.com/${item.dname.replace(/ /g, "_")}`,
            "icon_url": `http://cdn.dota2.com${item.img}`
        },
        fields,
        "description": desc.join("\n\n"),
        "footer": {
            "text": item.lore
        }
    };
}

module.exports = itemEmbed;

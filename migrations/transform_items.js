const fs = require("fs");

//const od_items = require("../json/od_items.json");
// should require from odota/dotaconstants from now on tho

const regex = /<[^>]*>/g;

function clean(str, times = 10) {
    for (let i = 0; i <= times; i++) {
        str = str.replace("<br />", "\n")
            .replace("  ", " ")
            .replace("\r", "")
            .replace(regex, "")
            .replace("+ ", "+");
    }

    let arr = str.split("\n");
    for (item in arr) {
        if (arr[item] == "" || arr[item] == "\r") arr.splice(item, 1)
    }

    return arr;
}

var items = [];

for (od_item in od_items) {
    od_obj = od_items[od_item]

    let item = {};
    item.true_name = od_item;
    item.id = od_obj.id;
    item.format_name = od_obj.dname;
    item.cost = od_obj.cost;
    item.cooldown = od_obj.cd;
    if (od_obj.desc != "") {
        item.description = clean(od_obj.desc);
    }
    if (od_obj.notes != "") {
        item.notes = clean(od_obj.notes);
    }
    if (od_obj.attrib != "") {
        let len = od_obj.attrib.split("\n").length;
        item.attributes = clean(od_obj.attrib, len);
        if (item.attributes.length > 9) console.log(od_item)
    }
    if (od_obj.lore != "") {
        item.lore = clean(od_obj.lore);
        if (item.lore.length > 1) console.log(od_item);
    }


    items.push(item);
}

fs.writeFile("../json/items.json", JSON.stringify(items, null, 4), (err) => {
    if (err) console.log(err)
    console.log("wrote")
})

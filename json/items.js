var items = require("dotaconstants").items;
for (item in items) {
    if (item.startsWith("recipe")) continue;
    if (items[`recipe_${item}`] && items[item].created) items[item].components.push(`recipe_${item}`);
}

items = require("../util/transformConstants")(items);

module.exports = items;

const findHero = require("../../util/findHero");
const getBuffer = require("../../util/getBuffer");

const aliases = require("../../json/aliases.json");
const allItems = require("../../util/transformConstants")(require("dotaconstants").items);
const courageItems = require("../../json/courage.json");

var Canvas = require("canvas");
var Image = Canvas.Image;

const all_boots = [
    "travel_boots",
    "phase_boots",
    "power_treads",
    "arcane_boots",
    "tranquil_boots",
    "guardian_greaves"
];

const locations = [
    {"x": 0, "y": 0, "w": 110, "h": 128},
    {"x": 110, "y": 0, "w": 85, "h": 64},
    {"x": 195, "y": 0, "w": 85, "h": 64},
    {"x": 280, "y": 0, "w": 85, "h": 64},
    {"x": 110, "y": 64, "w": 85, "h": 64},
    {"x": 195, "y": 64, "w": 85, "h": 64},
    {"x": 280, "y": 64, "w": 85, "h": 64},
];

async function exec(ctx) {
    let override = ctx.options.join(" ");
    
    let hero = findHero(override) || aliases[Math.floor(Math.random() * aliases.length)];
    let rand_boot = all_boots[Math.floor(Math.random() * all_boots.length)];
    let boots = allItems.find((item) => item.name == rand_boot);

    let items = [];
    for (let i = 0; i < 5; i++) {
        items.push(courageItems[Math.floor(Math.random() * courageItems.length)]);
    }

    let copypaste = `${hero.local} with ${boots.dname}, ${items.map((item) => allItems.find((a) => a.name == item).dname).join(", ")}`;
    let to_download = [
        `/images/heroes/${hero.name}_vert.jpg`,
        `/images/items/${boots.name}_lg.png`
    ];
    to_download.push(...items.map((item) => `/images/items/${item}_lg.png`));

    let res;
    try {
        let promises = to_download.map((uri) => getBuffer(`http://cdn.dota2.com/apps/dota2${uri}`, `${__dirname}/../..${uri}`));
        res = await Promise.all(promises);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    var canvas = new Canvas(365, 128);
    var context = canvas.getContext("2d");
    for (let img in res) {
        let image = new Image();
        image.src = res[img];
        
        let loc = locations[img];
        context.drawImage(image, loc.x, loc.y, loc.w, loc.h);

        if (img == res.length - 1) {
            let buff = [];
            canvas.pngStream().on("data", (data) => {
                buff.push(data);
            }).on("end", () => {
                let data = Buffer.concat(buff);

                return ctx.send({
                    "content": copypaste
                }, {
                    "file": data,
                    "name": "lol.png"
                });
            });
        }
    }
}

module.exports = {
    name: "courage",
    category: "fun",
    typing: true,
    exec
};

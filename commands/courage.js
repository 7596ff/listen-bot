var Canvas = require("canvas");
var Image = Canvas.Image;

const get_buffer = require("../util/get_buffer");
const od_heroes = require("../json/od_heroes.json");
const all_items = require("../json/items.json");

const all_boots = [
    "travel_boots",
    "phase_boots",
    "power_treads",
    "arcane_boots",
    "tranquil_boots",
    "guardian_greaves",

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

async function courage(message, client, helper) {
    try {
        await message.channel.sendTyping();
    } catch (err) {
        helper.log(message, err);
    }

    let hero = od_heroes[Math.floor(Math.random() * od_heroes.length)];
    let rand_boot = all_boots[Math.floor(Math.random() * all_boots.length)];
    let boots = all_items.find(item => item.true_name == rand_boot);

    let items = [];
    for (let i = 0; i < 5; i++) {
        let filtered = all_items.filter(item => item.courage);
        if (items.includes(filtered)) {
            i--;
        } else {   
            items.push(filtered[Math.floor(Math.random() * filtered.length)]);
        }
    }

    let copypaste = `${hero.localized_name} with ${boots.format_name}, ${items.map(item => item.format_name).join(", ")}`;
    let to_download = [
        `/images/heroes/${hero.name.replace("npc_dota_hero_", "")}_vert.jpg`,
        `/images/items/${boots.true_name}_lg.png`
    ];
    to_download.push(...items.map(item => `/images/items/${item.true_name}_lg.png`));

    Promise.all(to_download.map(uri => get_buffer(`http://cdn.dota2.com/apps/dota2${uri}`, `${__dirname}/..${uri}`))).then(res => {
        var canvas = new Canvas(365, 128);
        var ctx = canvas.getContext("2d");
        for (let img in res) {
            let image = new Image();
            image.src = res[img];

            let loc = locations[img];

            ctx.drawImage(image, loc.x, loc.y, loc.w, loc.h);

            if (img == res.length - 1) {
                let buff = [];
                canvas.pngStream().on("data", (data) => {
                    buff.push(data);
                }).on("end", () => {
                    let data = Buffer.concat(buff);
                    message.channel.createMessage({
                        "content": copypaste
                    }, {
                        "file": data,
                        "name": "lol.png"
                    }).then(() => {
                        helper.log(message, "sent courage");
                    }).catch(err => helper.handle(message, err));
                });
            }
        }
    }).catch(err => {
        message.channel.createMessage("Something went wrong.").catch(err => helper.handle(message, err));
        helper.log(message, err);
    });
}

module.exports = courage;

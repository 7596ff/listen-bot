const needle = require("needle");
const cheerio = require("cheerio");
const dd = require("dotaconstants");
const la = require("../json/abilities.json");
const keys = ["q", "w", "e", "d", "f"];
const fs = require("bluebird").promisifyAll(require("fs"));

var Canvas = require("canvas");
var Image = Canvas.Image;

async function getGuide(url) {
    return new Promise((resolve, reject) => {
        needle.get(url, (err, response, body) => {
            err ? reject(err) : resolve(body);
        });
    });
}

async function parseGuide(id) {
    return new Promise(async function(resolve, reject) {
        let url = `http://www.dota2.com/workshop/builds/view?embedded=workshop&publishedfileid=${id}`;
        let $;
        try {
            let page = await getGuide(url);
            $ = cheerio.load(page);
        } catch (err) {
            reject(err);
        }

        let sections = [];
        $(".itemBuildContainer").children().each((index, element) => {
            if ($(element).text().trim() != "") {
                let section = {
                    "name": $(element).text().trim(),
                    "items": []
                };

                $(element).parent().find(".itemBuildIconContainer").children().each((index, element) => {
                    section.items.push($(element).attr("itemname"));
                });

                if (section.name.toLowerCase() != "patreon.com/torte") sections.push(section);
            }
        });

        let abilityBuild = new Array(25).fill("none");
        $("#skillBuildContent").children().each((index, element) => {
            let name = $(element).attr("abilityname");
            $(element).children().each((index, element) => {
                $(element).find(".skillSet").each((index, element) => {
                    abilityBuild[parseInt($(element).text()) - 1] = name; 
                });
            });
        });

        let itemSummaries = [];
        $("#itemSummaryContent").children().each((index, element) => {
            itemSummaries.push({
                "item": $(element).find("div.itemImageSummary.itemIconWithTooltip").attr("itemname"),
                "description": $(element).find("div.itemSummaryText").text()
            });
        });

        let abilitySummaries = [];
        $("#abilitySummaryContent").children().each((index, element) => {
            abilitySummaries.push({
                "ability": $(element).find("img").attr("abilityname"),
                "description": $(element).find("div").text()
            });
        });

        resolve([
            sections,
            abilityBuild,
            itemSummaries,
            abilitySummaries
        ]);
    });
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function drawBuildImage(grid, images) {
    return new Promise(async function(resolve, reject) {
        try {
            var canvas = new Canvas(1220, grid.length * 64);
            var ctx = canvas.getContext("2d");

            grid.forEach((row, y) => {
                row.forEach((element, x) => {
                    let img = new Image();
                    img.src = images[element.toString()];
                    ctx.drawImage(img, x * 64, y * 64, 64, 64);
                });
            });

            await sleep(250); // kek

            let buff = [];
            canvas.pngStream().on("data", (data) => {
                buff.push(data);
            }).on("end", () => {
                let data = Buffer.concat(buff);
                resolve(data);
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

async function createBuildImage(getBuffer, hero, data) {
    return new Promise(async function(resolve, reject) {
        try {
            let abilities = data.filter((item) => item !== "none" && !item.startsWith("special_bonus")).filter((item, index, array) => array.indexOf(item) === index);
            let promises = abilities.map((a) => getBuffer(`http://cdn.dota2.com/${dd.abilities[a].img}`, `${__dirname}/../../images/abilities/${a}_md.png`));
            let buffers = await Promise.all(promises);

            let images = {};
            for (ability of abilities) {
                images[ability] = buffers[abilities.indexOf(ability)];
            }

            images["false"] = await fs.readFileAsync(`${__dirname}/../../images/grid/false.png`);
            images["true"] = await fs.readFileAsync(`${__dirname}/../../images/grid/true.png`);

            let ordered = new Array(abilities.length);
            abilities.forEach((abil) => {
                let key = la.find((skill) => skill.name == dd.abilities[abil].dname).key;
                if (keys.includes(key)) ordered[keys.indexOf(key)] = abil;
                if (key == "r") ordered[ordered.length - 1] = abil;
            });

            let grid = [];
            ordered.forEach((abil) => {
                let row = [abil];
                row.push(...data.map((element) => abil == element));
                grid.push(row);
            });

            let image = await drawBuildImage(grid, images);
            resolve(image);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

async function generateMessage(getBuffer, hero, guide, sections, abilityBuild, itemSummaries, abilitySummaries) {
    return new Promise(async function(resolve, reject) {
        try {
            let buildImage = await createBuildImage(getBuffer, hero, abilityBuild);
            
            let contents = [{
                "embed": {
                    "title": guide.title,
                    "url": guide.link,
                    "fields": sections.map((section) => {
                        return {
                            "name": section.name,
                            "value": section.items.map((item) => dd.items[item].dname).join(", "),
                            "inline": true
                        };
                    }),
                    "image": {
                        "url": "attachment://test.png"
                    }
                }
            }];

            let items = itemSummaries.map((summ) => {
                return {
                    "name": dd.items[summ.item].dname,
                    "value": summ.description,
                    "inline": true
                };
            });

            let abils = abilitySummaries.map((summ) => {
                let abil = dd.abilities[summ.ability];
                return {
                    "name": abil ? abil.dname : "Special Thanks",
                    "value": summ.description,
                    "inline": true
                };
            });

            let things = [];
            things.push(...items);
            things.push(...abils);

            while (things.length) {
                contents.push({
                    "embed": {
                        "title": guide.title,
                        "url": guide.link,
                        "fields": things.splice(0, 3),
                        "image": {
                            "url": "attachment://test.png"
                        }
                    }
                });
            }

            resolve({
                "contents": contents,
                "file": {
                    "file": buildImage,
                    "name": "test.png"
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function guide(message, client, helper) {
    await message.channel.sendTyping();

    let hero;
    try {
        hero = await client.core.util.find_hero(message.content.split(" ").slice(1).join(" "));
    } catch (err) {
        if (err === false) await message.channel.createMessage("Couldn't find that hero.").catch((err) => helper.handle(message, err));
        return;
    }

    let pretty_hero = client.core.json.od_heroes.find((od_hero) => od_hero.name == `npc_dota_hero_${hero}`).localized_name;
    let guides = client.core.json.torte.filter((guide) => guide.hero == pretty_hero);

    if (!guides.length) return message.channel.createMessage("No guides found for this hero.").catch((err) => helper.handle(message, err));

    let guide = guides[Math.floor(Math.random() * guides.length)];
    let backup = `${guide.title} ${guide.link}`;
    let msg;

    try {
        let guideData;
        let key = `listen:guidedata:${guide.id}`;
        let reply = await client.redis.getAsync(key);
        if (!reply) {
            guideData = await parseGuide(guide.id);
            await client.redis.setexAsync(key, 604800, JSON.stringify(guideData));
        } else {
            guideData = JSON.parse(reply);
        }

        msg = await generateMessage(client.core.util.get_buffer, hero, guide, ...guideData);
    } catch (err) {
        console.error(err);
        msg = backup;
    }

    try {
        let perms = message.channel.guild.members.get(client.user.id).permission.has("manageMessages");
        let sent = await message.channel.createMessage({
            "embed": msg.contents[0].embed,
            "content": perms && "Use ◀ and ▶ to scroll between pages."
        }, msg.file);
        helper.log(message, `sent guide to ${hero}`);
        if (perms) client.watchers[sent.id] = new client.core.util.watcher(client, sent, message.author.id, "p/n", msg.contents, 0);
    } catch (err) {
        await message.channel.createMessage(backup);
    }
}

module.exports = guide;

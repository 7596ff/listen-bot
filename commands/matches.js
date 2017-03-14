const matches_embed = require("../embeds/matches");
const resolve_dota_id = require("../util/resolve_dota_id");
const find_hero = require("../util/find_hero");
const eat = require("../util/eat");
const od_heroes = require("../json/od_heroes.json");

async function matches(message, client, helper) {
    try {
        await message.channel.sendTyping();
    } catch (err) {
        helper.log(message, err);
    }
    
    let response = await eat(message, {
        "with": "member",
        "of": "member",
        "as": "string"
    });

    if (response.err) {
        message.channel.createMessage("Something went wrong.").catch(err => helper.handle(message, err));
        helper.log(message, response.err);
        return;
    }

    let qids = [];

    if (response.with) {
        qids.push(message.author.id);
        qids.push(...response.with);
        qids.filter((el, i, arr) => arr.indexOf(el) === i);
    }

    if (response.of) {
        qids = [];
        qids.push(...response.of);
        if (response.with) qids.push(...response.with);
        qids.filter((el, i, arr) => arr.indexOf(el) === i);
    }

    if (!response.with && !response.of) qids.push(message.author.id);

    let hero_id = false;
    try { 
        let found_hero = await find_hero(response.as);
        hero_id = od_heroes.find(hero => hero.name == `npc_dota_hero_${found_hero}`).id;
    } catch (err) {
        if (err === false) {
            helper.log(message, `couldn't find hero ${response.as}`);
            message.channel.createMessage("I couldn't find that hero.").catch(err => helper.handle(message, err));
            return;
        }
    }

    Promise.all(qids.map(id => resolve_dota_id(message, id))).then(results => {
        results.forEach(result => {
            if (result.length < 1) {
                message.channel.createMessage("This user's account is private.").catch(err => helper.handle(message, err));
                return;
            }
        });

        let logmsg = `matches: ${results.join(", ")}`;
        if (hero_id) logmsg += ` as ${hero_id}`;
        helper.log(message, logmsg);

        let mika_opt = {
            "limit": 12,
            "included_account_id": results.slice(1)
        };

        if (hero_id) mika_opt.hero_id = hero_id;

        client.mika.getPlayerMatches(results[0], mika_opt).then(matches => {
            let embed = matches_embed(matches, `Use \`${message.gcfg.prefix}matchinfo\` to get more about a specific match.`);
            message.channel.createMessage({
                "embed": embed
            }).then(() => {
                helper.log(message, "sent matches");
            }).catch(err => helper.handle(message, err));
        }).catch(err => {
            helper.log(message, err);
            message.channel.createMessage("Something went wrong.").catch(err => helper.handle(message, err));
        });
    }).catch(err => {
        if (err.err) {
            message.channel.createMessage(err.text || "Something went wrong.").catch(err => helper.handle(message, err));
            helper.log(message, err.text);
            helper.log(message, err.err);
        } else if (err.text) {
            message.channel.createMessage(err.text).catch(err => helper.handle(message, err));
            helper.log(message, err.log);
        } else {
            message.channel.createMessage("Something went wrong.").catch(err => helper.handle(message, err));
            helper.log(message, err);
        }
    });
}

module.exports = matches;

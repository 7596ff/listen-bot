async function lastmatch(message, client, helper) {
    let locale = client.core.locale[message.gcfg.locale];

    try {
        await message.channel.sendTyping();
    } catch (err) {
        helper.handle(message, err);
    }
    
    let response = await client.core.util.eat(message, {
        "with": "member",
        "of": "member",
        "as": "string"
    });

    if ((!response.with && !response.of && !response.as) && !["lastmatch", "lm"].includes(message.content)) {
        let found_obj = await client.core.util.search_members(message.channel.guild.members, message.content.split(" ").slice(1));
        response.of = found_obj.all;
    }

    if (response.err) {
        message.channel.createMessage(locale.generic.generic).catch(err => helper.handle(message, err));
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
        let found_hero = await client.core.util.find_hero(response.as);
        hero_id = client.core.json.od_heroes.find(hero => hero.name == `npc_dota_hero_${found_hero}`).id;
    } catch (err) {
        if (err === false) {
            helper.log(message, `couldn't find hero ${response.as}`);
            message.channel.createMessage(locale.generic.noheroerror).catch(err => helper.handle(message, err));
            return;
        }
    }

    Promise.all(qids.map(id => client.core.util.resolve_dota_id(locale.resolve_dota_id, message, id))).then(results => {
        results.forEach(result => {
            if (result.length < 1) {
                message.channel.createMessage(locale.generic.privateaccount).catch(err => helper.handle(message, err));
                return;
            }
        });

        let logmsg = `lastmatch: ${results.join(", ")}`;
        if (hero_id) logmsg += ` as ${hero_id}`;
        helper.log(message, logmsg);

        let mika_opt = {
            "limit": 1,
            "included_account_id": results.slice(1)
        };

        if (hero_id) mika_opt.hero_id = hero_id;

        client.mika.getPlayerMatches(results[0], mika_opt).then(match => {
            if (match) {
                let match_id = match[0].match_id;
                message.content = `matchinfo ${match_id}`;
                client.core.commands.matchinfo(message, client, helper);
            }
        }).catch(err => {
            helper.log(message, err);
            message.channel.createMessage(locale.generic.generic).catch(err => helper.handle(message, err));
        });
    }).catch(err => {
        if (err.err) {
            message.channel.createMessage(err.text || locale.generic.generic).catch(err => helper.handle(message, err));
            helper.log(message, err.text);
            helper.log(message, err.err);
        } else if (err.text) {
            message.channel.createMessage(err.text).catch(err => helper.handle(message, err));
            helper.log(message, err.log);
        } else {
            message.channel.createMessage(locale.generic.generic).catch(err => helper.handle(message, err));
            helper.log(message, err);
        }
    });
}

module.exports = lastmatch;

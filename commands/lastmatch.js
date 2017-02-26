const matchinfo = require("./matchinfo");
const resolve_dota_id = require("../util/resolve_dota_id");
const search_members = require("../util/search_members");
const find_hero = require("../util/find_hero");
const od_heroes = require("../json/od_heroes.json");

module.exports = (message, client, helper) => {
    message.channel.sendTyping().then(() => {
        message.content = message.content.replace(/<@[0-9]+>/g, "");
        let options = message.content.split(" ");

        let has_with = options.includes("with");
        let has_as = options.includes("as");
        let has_of = options[1] == "of";

        let i_w = options.indexOf("with");
        let i_a = options.indexOf("as");
        let i_o = 1;

        let queries = [];
        let hero_id = false;

        if (has_of) {
            let of_who = options.slice(i_o + 1, (has_as && i_a > i_o ? i_a : options.length));
            let results = search_members(message.channel.guild.members, of_who);
            queries.push(...results.map(result => resolve_dota_id(message, result)));
            queries.push(...message.mentions.map(user => resolve_dota_id(message, user.id)));
            
            if (has_as) {
                let as_who = options.slice(i_a + 1, (has_of && i_o > i_a ? i_o : options.length));
                find_hero(as_who.join(" ")).then(found_hero => {
                    if (found_hero.not_found) {
                        hero_id = false;
                    } else {
                        hero_id = od_heroes.find(hero => hero.name == `npc_dota_hero_${found_hero}`).id;
                    }
                });
            }
        } else {
            queries.push(resolve_dota_id(message, message.author.id));

            if (has_with) {
                let with_who = options.slice(i_w + 1, (has_as && i_a > i_w ? i_a : options.length));
                let results = search_members(message.channel.guild.members, with_who);
                queries.push(...results.map(result => resolve_dota_id(message, result)));
                queries.push(...message.mentions.map(user => resolve_dota_id(message, user.id)));
            }

            if (has_as) {
                let as_who = options.slice(i_a + 1, (has_with && i_w > i_a ? i_w : options.length));
                find_hero(as_who.join(" ")).then(found_hero => {
                    if (found_hero.not_found) {
                        hero_id = false;
                    } else {
                        hero_id = od_heroes.find(hero => hero.name == `npc_dota_hero_${found_hero}`).id;
                    }
                });
            }
        }

        if (queries.length < (has_with ? 2 : 1)) {
            message.channel.createMessage("Strange, I couldn't find any server members in your query. Make sure you formatted your command correctly.").catch(err => helper.handle(message, err));
            helper.log(message, "strange query");
            helper.log(message, message.content);
            return;
        }

        Promise.all(queries).then(results => {
            results.forEach(result => {
                if (result.length < 1) {
                    message.channel.createMessage("This user's account is private.").catch(err => helper.handle(message, err));
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
                    matchinfo(message, client, helper);
                }
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
    });
};

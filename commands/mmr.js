const upsert_mmr = require("../util/upsert_mmr");
const search_members = require("../util/search_members");

function single_mmr_embed(obj) {
    return {
        "author": {
            "icon_url": obj.member.avatarURL,
            "name": obj.member.username
        },
        "description": [
            `**Solo MMR:** ${obj.scr || "Unknown"}`,
            `**Party MMR:** ${obj.cr || "Unknown"}`
        ].join("\n"),
        "timestamp": new Date(obj.sat ? parseInt(obj.sat) : Date.now()),
        "footer": {
            "text": "Last updated"
        }
    };
}

function many_mmr_embed(list, members, name) {
    let earliest = list.slice().sort((a, b) => { return a.sat - b.sat; })[0].sat;
    return {
        "author": {
            "name": `Top 15 players sorted by Solo MMR in ${name}`
        },
        "fields": [{
            "name": "Players",
            "value": list.map(row => members.get(row.id).username).join("\n"),
            "inline": true
        }, {
            "name": "Solo",
            "value": list.map(row => row.scr || "Unknown").join("\n"),
            "inline": true
        }, {
            "name": "Party",
            "value": list.map(row => row.cr || "Unknown").join("\n"),
            "inline": true
        }],
        "timestamp": new Date(parseInt(earliest)),
        "footer": {
            "text": "Last updated"
        }
    };
}

async function mmr(message, client, helper) {
    const subcommand = message.content.split(" ").slice(1)[0];
    let id = message.author.id;

    if (subcommand == "all") {
        try {
            let msg = await message.channel.createMessage({
                "embed": {
                    "description": "Hold tight while I grab the latest data."
                }
            });
            let res = await client.pg.query("SELECT * FROM public.users;");
            res.rows = res.rows.filter(row => message.channel.guild.members.get(row.id));

            let queries = res.rows.map(row => upsert_mmr(client.pg, client.mika, row));
            let results = await Promise.all(queries);

            let embed = many_mmr_embed(results.sort((a, b) => { 
                return (b.scr || 0) - (a.scr || 0); 
            }).slice(0, 15), message.channel.guild.members, message.channel.guild.name);

            await msg.edit({ "embed": embed});
            helper.log(message, "sent all mmr");
        } catch (err) {
            if (err._origin) helper.log("mmr", `error in ${err._origin}`, "error");
            helper.log("mmr", err, "error");
        }

        return;
    }

    if (subcommand == "of") {
        try {
            let terms = message.content.split(" ").slice(2);
            if (terms.length < 1) {
                message.channel.createMessage("Please specify a member!").catch(err => helper.handle(message, err));
                return;
            }

            let found = await search_members(message.channel.guild.members, terms);
            if (found.length != 1) {
                message.channel.createMessage("Couldn't find a member!").catch(err => helper.handle(message, err));
                return;
            }

            id = found[0];
        } catch (err) {
            helper.log("mmr", err, "err");
        }
    }

    try {
        let res = await client.pg.query({
            "text": "SELECT * FROM public.users WHERE id = $1",
            "values": [id]
        });

        let upserted = await upsert_mmr(client.pg, client.mika, res.rows[0], true);

        upserted.member = message.channel.guild.members.get(id);
        let embed = single_mmr_embed(upserted);

        await message.channel.createMessage({ "embed": embed });
        helper.log(message, "sent mmr of a user");
    } catch (err) {
        if (err == "nouser") {
            message.channel.createMessage(`${message.channel.guild.members.get(id).username} has not registered yet! Try \`${message.gcfg.prefix}help register\`.`)
                .catch(err => helper.handle(message, err));
        } else {
            if (err._origin) helper.log("mmr", `error in ${err._origin}`, "error");
            helper.log("mmr", err, "error");
        }
    }
}

module.exports = mmr;

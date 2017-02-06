const od_heroes = require("../json/od_heroes.json");

function playerinfo_embed(player) {
    let winrate = (player.wl.win / (player.wl.win + player.wl.lose));
    winrate = winrate * 10000;
    winrate = Math.round(winrate);
    winrate = winrate / 100;

    let countrycode = player.profile.loccountrycode ? player.profile.loccountrycode : "Unknown";
    let flag = countrycode == "Unknown" ? "" : `:flag_${countrycode.toLowerCase()}:`;

    let mmr_display = [];
    let mmr = [];

    if (player.solo_competitive_rank) {
        mmr_display.push("solo");
        mmr.push(player.solo_competitive_rank);
    }

    if (player.competitive_rank) {
        mmr_display.push("party");
        mmr.push(player.competitive_rank);
    }

    if (player.mmr_estimate.estimate) {
        mmr_display.push("est.");
        mmr.push(player.mmr_estimate.estimate);
    }

    if (mmr.length < 1) {
        mmr.push("No mmr data found.");
    }

    let display_heroes = [];
    player.heroes = player.heroes.slice(0, 5);
    for (let hero in player.heroes) {
        let local_name = od_heroes.find(od_hero => od_hero.id == player.heroes[hero].hero_id).localized_name;
        let winrate = (player.heroes[hero].win / player.heroes[hero].games);
        winrate = winrate * 10000;
        winrate = Math.round(winrate);
        winrate = winrate / 100;
        display_heroes.push(`(${winrate}% with ${player.heroes[hero].games} games) **${local_name}**`);
    }

    let dotabuff_link = `https://www.dotabuff.com/players/${player.profile.account_id}`;
    let opendota_link = `https://www.opendota.com/players/${player.profile.account_id}`;

    return {
        "title": `Player Stats for ${player.profile.personaname}`,
        "fields": [
            {
                "name": `MMR: ${mmr_display.join(" / ")}`,
                "value": mmr.join(" / "),
                "inline": true
            },
            {
                "name": "Wins/Losses",
                "value": `${player.wl.win}/${player.wl.lose} (${winrate}%)`,
                "inline": true
            },
            {
                "name": "Country",
                "value": `${flag} ${countrycode}`,
                "inline": true
            },
            {
                "name": "Links",
                "value": `[DB](${dotabuff_link}) / [OD](${opendota_link}) / [Steam](${player.profile.profileurl})`,
                "inline": true
            },
            {
                "name": "Top 5 Heroes",
                "value": display_heroes.join("\n"),
                "inline": false
            }
        ],
        "thumbnail": {
            "url": player.profile.avatarfull
        }
    };
}

module.exports = (message, client, helper) => {
    let options = message.content.split(" ");
    let acc_id = options[1];

    if (!acc_id) {
        message.channel.createMessage("Please supply an account ID!");
        return;
    }

    if (acc_id.match("dotabuff") || acc_id.match("opendota")) {
        let url = acc_id.split("/");
        acc_id = url[url.length - 1];
    }

    if (isNaN(acc_id)) {
        message.channel.createMessage("I couldn't find an account ID in your message!");
        return;
    }

    helper.log(message, `playerinfo: ${acc_id}`);

    message.channel.createMessage("loading...").then(new_message => {
        client.redis.get(`playerinfo:${acc_id}`, (err, reply) => {
            if (err) helper.log(message, err);
            if (reply) {
                new_message.edit({ embed: playerinfo_embed(JSON.parse(reply)) }).then(() => {
                    helper.log(message, "  sent player info");
                }).catch(err => helper.handle(message, err));
            } else {
                client.mika.getPlayer(acc_id).then(player => {
                    client.mika.getPlayerWL(acc_id).then(wl => {
                        client.mika.getPlayerHeroes(acc_id).then(heroes => {
                            player.wl = wl;
                            player.heroes = heroes;

                            new_message.edit({ embed: playerinfo_embed(player) }).then(() => {
                                helper.log(message, "  sent player info");
                            }).catch(err => helper.handle(message, err));

                            client.redis.set(`playerinfo:${acc_id}`, JSON.stringify(player), (err) => {
                                if (err) helper.log(message, err);
                                client.redis.expire(`playerinfo:${acc_id}`, 3600);
                            });
                        });
                    }).catch(err => {
                        helper.log(message, `mika failed with statusCode ${err.statusCode}`);
                        new_message.edit("Something went wrong.");
                    });
                }).catch(err => {
                    helper.log(message, `mika failed with statusCode ${err.statusCode}`);
                    new_message.edit("Something went wrong.");
                });
            }
        });
    });
};

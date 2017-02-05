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
                "value": `${countrycode} ${flag}`,
                "inline": true
            },
            {
                "name": "Profile URL",
                "value": `[${player.profile.personaname}](${player.profile.profileurl})`,
                "inline": true
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

    if (acc_id.match("dotabuff") || acc_id.match("opendota")) {
        console.log('found a link')
        let url = acc_id.split("/");
        acc_id = url[url.length - 1];
    }

    if (isNaN(acc_id)) {
        message.channel.createMessage("I couldn't find an account ID in your message!");
        return;
    }

    helper.log(message, `playerinfo: ${acc_id}`)

    message.channel.createMessage("loading...").then(new_message => {
        client.mika.getPlayer(acc_id).then(player => {
            client.mika.getPlayerWL(acc_id).then(wl => {
                player.wl = wl
                new_message.edit({
                    embed: playerinfo_embed(player)
                }).then(() => {
                    helper.log(message, "  sent player info")
                }).catch(err => helper.handle(message, err));
            }).catch(err => {
                helper.log(message, `mika failed with statusCode ${err.statusCode}`);
                new_message.edit("Something went wrong.");
            });
        }).catch(err => {
            helper.log(message, `mika failed with statusCode ${err.statusCode}`);
            new_message.edit("Something went wrong.");
        });
    });
}

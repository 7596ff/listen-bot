// updates mmr bsaed on dota 2 leaderboards and stores it in redis.
// filters duplicate names fom leaderboards.

const config = require("../config.json");
const redis = require("redis");
const needle = require("needle");

const regions = ["americas", "europe", "se_asia", "china"];
const URL = "http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=";

this.log = function(str) {
    console.log(`${new Date().toJSON()} [L_MMR] ${str}`);
}

var client = redis.createClient(config.redisconfig);
var sub = redis.createClient(config.redisconfig);

sub.subscribe("__keyevent@0__:expired", (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        this.log("subscribed to keyevent expired");
    }
});

this.updateMMR = function(region) {
    needle.get(`${URL}${region}`, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let leaderboard = body.leaderboard.map((player) => {
                return {
                    "name": player.name,
                    "solo_mmr": player.solo_mmr,
                    "country": player.country
                }
            }).filter((item, index, array) => {
                if (array.indexOf(array.find(_item => item.name == _item.name)) == index) return true;
            });

            this.log(`got new leaderboard for ${region}, length ${leaderboard.length}, saving to redis`);

            client.set(`prommr:${region}`, JSON.stringify({
                "lastupdated": Date.now(),
                "leaderboard": leaderboard
            }));

            client.setex(`prommr:${region}:expire`, body.next_scheduled_post_time * 1000 - Date.now(), true);
        }
    });
}

sub.on("message", (channel, message) => {
    if (!message.startsWith("prommr")) return;

    let region = message.split(":")[1];
    if (regions.includes(region)) this.updateMMR(region);
});

client.on("ready", () => {
    this.log("redis ready");
    regions.forEach(region => this.updateMMR(region));
});

sub.on("ready", () => {
    this.log("sub ready");
});

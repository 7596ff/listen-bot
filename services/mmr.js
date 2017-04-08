// updates mmr bsaed on dota 2 leaderboards and stores it in redis.
// filters duplicate names fom leaderboards.

const config = require("../config.json");
const bluebird = require("bluebird");
const redis = require("redis");
const needle = require("needle");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const regions = ["americas", "europe", "se_asia", "china"];
const URL = "http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=";

this.log = function(str) {
    if (typeof str == "string") {
        console.log(`${new Date().toJSON()} [L_MMR] ${str}`);
    } else {
        console.log(str);
    }
}

var client = redis.createClient(config.redisconfig);
var sub = redis.createClient(config.redisconfig);

this.sleep = function(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

sub.subscribe("__keyevent@0__:expired", (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        this.log("subscribed to keyevent expired");
    }
});

async function updateMMR(region) {
    needle.get(`${URL}${region}`, (err, response, body) => {
        if (err) return;
        if (response.statusCode != 200) return;

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

        try {
            let data = JSON.stringify({
                "lastupdated": body.time_posted * 1000,
                "leaderboard": leaderboard
            });

            client.setAsync(`prommr:${region}`, data);

            client.setexAsync(`prommr:${region}:expire`, body.next_scheduled_post_time - Math.floor(Date.now() / 1000), true);
        } catch (err) {
            this.log("redis err");
            this.log(err);
        }
    });
}

async function saveOldMMR(region) {
    try {
        let old = await client.getAsync(`prommr:${region}`);
        await client.setAsync(`prommr:${region}:old`, old);
        this.log(`saved old data for ${region}`);
    } catch (err) {
        this.log("redis err");
        this.log(err);
    }
}

this.onMessage = async function(channel, message) {
    if (!message.startsWith("prommr")) return;

    let region = message.split(":")[1];
    if (regions.includes(region)) {
        await this.sleep(60);
        await saveOldMMR.call(this, region);
        await updateMMR.call(this, region);
    }
}

sub.on("message", (channel, message) => this.onMessage.call(this, channel, message));

client.on("ready", () => {
    this.log("redis ready");
    regions.forEach(region => updateMMR.call(this, region));
});

sub.on("ready", () => {
    this.log("sub ready");
});

// updates mmr bsaed on dota 2 leaderboards and stores it in redis.
// filters duplicate names fom leaderboards.

const config = require("../config.json");
const redis = require("redis");
const needle = require("needle");
const schedule = require("node-schedule");

const regions = ["americas", "europe", "se_asia", "china"];
const URL = "http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=";

const jobs = {};

this.log = function(str) {
    if (typeof str == "string") {
        console.log(`${new Date().toJSON()} [L_MMR] ${str}`);
    } else {
        console.log(str);
    }
}

var client = redis.createClient(config.redisconfig);
var sub = redis.createClient(config.redisconfig);

function getNewMMR(region) {
    return new Promise((resolve, reject) => {
        needle.get(`${URL}${region}`, (err, response, body) => {
            if (err) reject({
                "message": "err retrieving new mmr from steam",
                "err": err
            });

            if (response.statusCode != 200) reject({
                "message": "err retrieving new mmr from steam",
                "err": response.statusCode
            });

            let leaderboard = body.leaderboard.map((player) => {
                return {
                    "name": player.name,
                    "solo_mmr": player.solo_mmr,
                    "country": player.country
                }
            }).filter((item, index, array) => {
                if (array.indexOf(array.find(_item => item.name == _item.name)) == index) return true;
            });

            let data = JSON.stringify({
                "lastupdated": body.time_posted * 1000,
                "leaderboard": leaderboard
            });

            client.set(`prommr:${region}`, data, (err) => {
                if (err) {
                    reject({
                        "message": "err setting new mmr data in redis",
                        "err": err
                    });
                } else {
                    resolve({
                        "length": leaderboard.length,
                        "region": region
                    });
                }
            });
        });
    });
}

function saveOldMMR(region) {
    return new Promise((resolve, reject) => {
        client.get(`prommr:${region}`, (err, reply) => {
            if (err) {
                reject({
                    "message": "error getting old mmr",
                    "err": err
                });
            } else {
                client.set(`prommr:${region}`, reply, (err) => {
                    if (err) {
                        reject({
                            "message": "err setting old mmr",
                            "err": err
                        });
                    } else {
                        resolve(region);
                    }
                });
            }
        });
    });
}

function cycleMMR() {
    Promise.all(regions.map((region) => saveOldMMR.call(this, region))).then((results) => {
        results.forEach((result) => this.log(`saved old mmr data to redis for region ${result}`));
        Promise.all(results.map((result) => getNewMMR.call(this, result))).then((results) => {
            results.forEach((result) => this.log(`got new leaderboard for ${result.region}, length ${result.length}, saved to redis`));
        });
    });
}

client.on("ready", () => {
    this.log("redis ready");
    Promise.all(regions.map((region) => getNewMMR.call(this, region))).then((results) => {
        results.forEach((result) => this.log(`got new leaderboard for ${result.region}, length ${result.length}, saved to redis`));
    });

    jobs.mmr = schedule.scheduleJob("30 18 * * *", cycleMMR);
});

sub.on("ready", () => {
    this.log("sub ready");
});

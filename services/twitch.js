// gets twitch clips and top dota 2 streams periodically 

const config = require("../config.json");
const redis = require("redis");
const needle = require("needle");
const schedule = require("node-schedule");
const query_string = require("../core/util/query_string");

const BASE_URL = "https://api.twitch.tv/kraken";
const jobs = {};

var client = redis.createClient(config.redisconfig);

function log(str) {
    if (typeof str == "string") {
        console.log(`${new Date().toJSON()} [L_TWITCH] ${str}`);
    } else {
        console.log(str);
    }
}

function headers(version) {
    return {
        "headers": {
            "Client-ID": config.twitch.client_id,
            "Accept": `application/vnd.twitchtv.v${version}+json`
        }
    };
}

function getClips() {
    log("getting new clips");

    let url = `${BASE_URL}/clips/top`;
    url += query_string({
        "game": "Dota 2",
        "period": "day",
        "limit": 20
    });

    needle.get(url, headers(4), (err, response, body) => {
        if (err || response.statusCode != 200) {
            log("clips error");
            log(`statusCode: ${response.statusCode}`);
            log(err);
            log(response);
            return;
        }

        log("got some clips, saving to redis");

        body = JSON.stringify(body);

        client.set("twitch:clips", body, (err, reply) => {
            err ? log(err) : log("clips saved");
        });
    });
}

function getStreams() {
    log("getting new streams");

    let url = `${BASE_URL}/streams`;
    url += query_string({
        "game": "Dota 2",
        "limit": 100
    });

    needle.get(url, headers(5), (err, response, body) => {
        if (err || response.statusCode != 200) {
            log("streams error");
            log(`statusCode: ${response.statusCode}`);
            log(err);
            log(response);
            return;
        }

        log("got some streams, saving to redis");

        body = JSON.stringify(body);

        client.set("twitch:clips", body, (err, reply) => {
            err ? log(err) : log("clips saved");
        });
    });
}

client.on("ready", () => {
    log("redis ready");
    
    getClips();
    getStreams();

    jobs.clips = schedule.scheduleJob("*/60 * * * *", getClips);
    jobs.streams = schedule.scheduleJob("*/10 * * * *", getStreams);
});
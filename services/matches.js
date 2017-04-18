// checks last matches of players based on database 
// stores them in redis and publishes them as well

const config = require("../config.json");
const Redis = require("redis");
const Postgres = require("pg");
const Mika = require("mika");

const redis = Redis.createClient();
const sub = Redis.createClient();
const pg = new Postgres.Client(config.pgconfig);
const mika = new Mika(2);

sub.subscribe("__keyevent@0__:expired");
sub.subscribe("listen:matches:in");
sub.subscribe("listen:matches:new");

function log(str) {
    if (typeof str == "string") {
        console.log(`${new Date().toJSON()} [L_MATCHES] ${str}`);
    } else {
        console.log(str);
    }
}

function getLastMatch(dotaID) {
    let key = `listen:matches:dotaid:${dotaID}`;

    redis.get(key, (err, reply) => {
        mika.getPlayerMatches(dotaID, {
            "limit": 1
        }).catch((err) => console.log(err)).then((res) => {
            let matchID = res[0] && res[0].match_id;

            redis.set(key, matchID, (err, reply) => {
                if (err) console.log(err);
            });
            redis.setex(`${key}:expire`, 1200, true, (err, reply) => {
                if (err) console.log(err);
            });

            if (reply && matchID != reply) {
                log(`new match ${dotaID}/${matchID}`);
                redis.publish("listen:matches:out", JSON.stringify({
                    "type": "dotaid",
                    "dotaid": dotaID,
                    "matchid": matchID
                }));
            }
        });
    });
}

function unsubDotaId(dotaID) {
    let error = false;

    redis.del(`listen:matches:dotaid:${dotaID}`, (err, reply) => {
        if (err) error = err;
    });

    redis.del(`listen:matches:dotaid:${dotaID}:expire`, (err, reply) => {
        if (err) error = err;
    });

    log(error || `unsubbed from ${dotaID}`);
}

sub.on("message", (channel, message) => {
    if (channel == "__keyevent@0__:expired") {
        if (!message.startsWith("listen:matches:in")) return;
        if (!message.endsWith("expire")) return;
        message = message.content.split(":");
        const type = message[2];
        const id = message[3];

        if (type == "dotaid") getLastMatch(id);
    }

    if (channel == "listen:matches:in") {
        message = JSON.parse(message);
        if (message.type == "dotaid") getLastMatch(message.dotaid);
    }

    if (channel == "listen:matches:new") {
        message = JSON.parse(message);
        if (message.action == "add") {
            if (message.type == "dotaid") {
                log(`subbed to ${message.dotaid}`);
                getLastMatch(message.dotaid);
            }
        }

        if (message.action == "remove") {
            if (message.type == "dotaid") unsubDotaId(message.dotaid);
        }
    }
});

pg.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    log("pg ready");

    pg.query("SELECT * from subs;").catch((err) => {
        console.log(err);
        process.exit(1);
    }).then((res) => {
        if !(res.rows.length) return;

        let dotaidrows = res.rows.filter((row) => row.dotaid);
        if (!dotaidrows.length) return;

        log(`rescheduling sub sequcnce for ${dotaidrows.length}`);
        dotaidrows.forEach((row) => {
            redis.publish("listen:matches:in", JSON.stringify({
                "type": "dotaid",
                "dotaid": row.dotaid
            }));
        });
    });
});

redis.on("ready", () => log("redis ready"));
sub.on("ready", () => log("redis sub ready"));

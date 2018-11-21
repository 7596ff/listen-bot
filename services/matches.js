// subscribes to live match updates for players

const config = require("../config.json");
const Redis = require("redis");
const Postgres = require("pg");
const FeedClient = require("mika").FeedClient;
var client = new FeedClient();

const redis = Redis.createClient();
const sub = Redis.createClient();
const pg = new Postgres.Client(config.pgconfig);

const types = ["player", "team", "league"];

sub.subscribe("listen:matches:new");

function log(str) {
    if (typeof str == "string") {
        console.log(`${new Date().toJSON()} [L_MATCHES] ${str}`);
    } else {
        console.log(str);
    }
}

function getNextMatchPlayers() {
    return new Promise((resolve, reject) => {
        redis.keys("listen:nextmatch:*", (err, reply) => {
            if (err) return reject(err);

            let map = reply.map((str) => Number(str.split(":")[2]));
            return resolve(map);
        });
    });
}

async function refresh() {
    try {
        let subs = await client.getSubs();
        let res = await pg.query("SELECT * FROM subs WHERE type = 'player';");

        let oldplayers = subs.player;
        let newplayers = res.rows.filter((row) => row.value != "1").map((row) => parseInt(row.value)).filter((item, index, array) => array.indexOf(item) === index);

        let nmplayers = await getNextMatchPlayers();
        newplayers.push(...nmplayers);
        newplayers = newplayers.filter((item, index, array) => array.indexOf(item) === index);

        let toAdd = newplayers.filter((player) => !~oldplayers.indexOf(player));
        let toRemove = oldplayers.filter((player) => !~newplayers.indexOf(player));

        log(`attempting to add ${toAdd.length || 0} subs and remove ${toRemove.length || 0}, old count: ${oldplayers.length || 0}`);

        let all = await client.subscribe("player", toAdd);
        let removed = await client.unsubscribe("player", toRemove);
        let newsubs = await client.getSubs();

        log(`added ${toAdd.length || 0}, removed ${removed.ids.length || 0}, new count: ${newsubs.player.length}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

sub.on("message", (channel, message) => {
    try {
        message = JSON.parse(message);
    } catch (err) {
        console.log(err);
        return;
    }

    if (message.action == "add") {
        client.subscribe(message.type, message.ids).catch((err) => console.error(err)).then((res) => {
            log(`added some ids of type ${res.type}, new length ${res.ids.length || 0}`);
        });
    } else if (message.action == "remove") {
        client.unsubscribe(message.type, message.ids).catch((err) => console.error(err)).then((res) => {
            log(`removed some ids of type ${res.type}, amount removed ${res.ids.length || 0}`);
        });
    } else if (message.action == "refresh") {
        refresh();
    }
});

pg.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    log("pg ready");
    client.connect();
});

client.on("match", (match, found, origin) => {
    if (origin == "scanner") redis.publish("listen:matches:out", JSON.stringify({
        id: match.match_id,
        found
    }));
});

client.on("error", (err) => {
    console.error(err)
    process.exit(1);
});

client.on("ready", () => {
    log("feed client ready");
    pg.query("SELECT * FROM subs;").catch((err) => console.error(err)).then((res) => {
        let rows = res.rows.filter((row) => types.includes(row.type));
        types.forEach((type) => {
            if (type == "player") {
                refresh();
            } else {
                let ids = rows.filter((row) => row.type == type && row.value != "1").map((id) => id.value);
                if (ids.length > 0) {
                    client.subscribe(type, ids).catch((err) => console.error(err)).then((res) => {
                        log(`subscribed to ${res.ids.length || 0} ids of type ${type}`);
                    });
                } else {
                    log(`couldn't find ids for type ${type}`);
                }
            }
        });
    });
});

redis.on("ready", () => log("redis ready"));
sub.on("ready", () => log("redis sub ready"));


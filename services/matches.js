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

sub.on("message", (channel, message) => {
    try {
        message = JSON.parse(message);
    } catch (err) {
        console.log(err);
        return;
    }

    if (message.action == "add") {
        client.subscribe(message.type, message.ids).catch((err) => console.error(err)).then((res) => {
            log(`added some ids of type ${res.type}, new length ${res.ids.length}`);
        });
    } else if (message.action == "remove") {
        client.unsubscribe(message.type, message.ids).catch((err) => console.error(err)).then((res) => {
            log(`removed some ids of type ${res.type}, amount removed ${res.ids.length}`);
        });
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

client.on("ready", () => {
    log("feed client ready");
    pg.query("SELECT * FROM subs;").catch((err) => console.error(err)).then((res) => {
        let rows = res.rows.filter((row) => types.includes(row.type));
        types.forEach((type) => {
            let ids = rows.filter((row) => row.type === type);
            if (ids.length > 0) {
                client.subscribe(type, ids).catch((err) => console.error(err)).then((res) => {
                    log(`subscribed to ${res.ids.length} ids of type ${type}`);
                });
            } else {
                log(`couldn't find ids for type ${type}`);
            }
        });
    });
});

redis.on("ready", () => log("redis ready"));
sub.on("ready", () => log("redis sub ready"));

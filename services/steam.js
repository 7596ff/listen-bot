const Steam = require("steam");
const Redis = require("redis");
const Postgres = require("pg");

const bignumber = require("bignumber.js");

const config = require("../config.json");

var sub = Redis.createClient(config.redisconfig);
var redis = Redis.createClient(config.redisconfig);

var pg = new Postgres.Client(config.pgconfig);
var steam_client = new Steam.SteamClient();
var steam_user = new Steam.SteamUser(steam_client);
var steam_friends = new Steam.SteamFriends(steam_client);

function log(str) {
    if (typeof str == "string") {
        console.log(`${new Date().toJSON()} [STEAM] ${str}`);
    } else {
        console.log(str);
    }
}

steam_client.on("connected", () => {
    log("connected to steam.");
    steam_user.logOn(config.steam_config);
});

steam_client.on("logOnResponse", () => {
    steam_friends.setPersonaState(Steam.EPersonaState.Online);
    log("logged on to steam.");
    redis.publish("steam", JSON.stringify({
        "code": 0,
        "message": "connected"
    }));
});

steam_client.on("error", (err) => {
    if (err.toString().match("Error: Disconnected")) {
        log("disconnected from steam. reconnecting in 10 seconds...");
    } else {
        log(err);
    }

    redis.publish("steam", JSON.stringify({
        "code": 1,
        "message": "disconnected from steam"
    }));

    setTimeout(() => { 
        log("reconnecting to steam...");
        steam_client.connect();
    }, 10000);
});

steam_friends.on("friend", (id, relationship) => {
    if (relationship == 3) {
        steam_friends.sendMessage(id, "Please send me the code you recieved on Discord!");
        log(`accepted a friend request: ${id}`);
    }
});

process.on("exit", (code) => {
    log(`steam exiting with code ${code}`);
    redis.publish("steam", JSON.stringify({
        "code": 1,
        "message": "disconnected from steam"
    }));
});

steam_friends.on("friendMsg", (steam_id, message) => {
    let q = `register:${steam_id}`;
    redis.get(q, (err, reply) => {
        if (err) log(err);
        if (!reply) return;
        reply = reply.split(":");
        let code = reply[0];
        let discord_id = reply[1];
        if (code == message.trim()) {
            let dota_id = new bignumber(steam_id).minus("76561197960265728");

            pg.query({
                "text": "SELECT * FROM public.users WHERE id = $1;",
                "values": [discord_id]
            }).then(res => {
                let query = { "values": [discord_id, parseInt(steam_id), parseInt(dota_id)] };

                if (res.rowCount == 0) {
                    query.text = "INSERT INTO public.users (id, steamid, dotaid) VALUES ($1, $2, $3);";
                } else {
                    query.text = "UPDATE public.users SET id = $1, steamid = $2, dotaid = $3 WHERE id = $1;";
                }

                pg.query(query).then(() => {
                    let action = res.rowCount == 0 ? "inserted" : "updated";
                    redis.publish("steam", JSON.stringify({
                        "code": 3,
                        "message": `${action} a user`,
                        "discord_id": discord_id,
                        "steam_id": steam_id,
                        "dota_id": dota_id
                    }));
                    steam_friends.removeFriend(steam_id);
                }).catch(err => {
                    log("something went wrong inserting or updating a user");
                    log(err);
                });
            }).catch(err => {
                log("something went wrong selecting a user");
                log(err);
            });
        }
    });
});

sub.on("message", (channel, message) => {
    if (channel == "discord") {
        message = JSON.parse(message);
        log(`REDIS: ${message.message}`);

        switch(message.code) {
        case 3:
            steam_friends.addFriend(message.steam_id);
            break;
        case 4:
            if (steam_client.connected) redis.publish("steam", JSON.stringify({
                "code": 4,
                "message": "pong"
            }));
            break;
        }
    }
});

redis.on("ready", () => {
    log("redis ready.");
    pg.connect((err) => {
        if (err) {
            log("err conencting to client");
            log(err);
            process.exit(1);
        }

        log("pg ready.");
        steam_client.connect();
    });
});

sub.on("ready", () => {
    log("redis sub ready.");
    sub.subscribe("discord");
});

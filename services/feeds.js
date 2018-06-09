const config = require("../config.json");
const feeds = require("../json/feeds.json");

const Redis = require("redis");
const schedule = require("node-schedule");
const needle = require("needle");
const queryString = require("../util/queryString");

const redis = Redis.createClient();
const jobs = {};

function log(str) {
    if (typeof str === "string") {
        console.log(`${new Date().toJSON()} [L_CRON] ${str}`);
    } else {
        console.log(str);
    }
}

function encodeURL(url, qs) {
    if (qs) url += queryString(qs);
    return url;
}

async function consumeResponse(feed, body) {
    if (feed.action === "store") {
        redis.set(feed.key, JSON.stringify(body), (err) => {
            err ? console.error(err) : log(`stored feed ${feed.name} in redis`);
        });
    } else if (feed.action === "publish") {
        let post = {};
        post.author = feed.name;

        if (feed.key === "listen:rss:blog") {
            post.title = body.rss.channel.item[0].title;
            post.link = body.rss.channel.item[0].link;
            post.guid = body.rss.channel.item[0].guid._;
        }

        if (feed.key === "listen:rss:steamnews") {
            let newsItem = body.appnews.newsitems.filter((item) => item.feedname === "steam_updates" || item.feedname === "steam_community_announcements")[0];
            if (newsItem.date * 1000 > Date.now() - 3600000) {
                post.title = newsItem.title;
                post.link = newsItem.url;
                post.guid = newsItem.gid;
            }
        }

        if (feed.key === "listen:rss:belvedere" || feed.key === "listen:rss:wykrhm" || feed.key === "listen:rss:magesunite") {
            post.title = body.feed.entry[0].title;
            post.link = body.feed.entry[0].link.$.href;
            post.guid = body.feed.entry[0].id;
        }

        if (feed.key === "listen:rss:magesunite" && !post.title.includes("Update")) {
            post.guid = false;
        }

        if (post.guid) {
            redis.get(`${feed.key}:last`, (err, reply) => {
                if (err) {
                    console.error(err);
                } else if (reply !== post.guid) {
                    log(`new post found for ${feed.name}, publishing`);
                    redis.publish(feed.key, JSON.stringify(post));
                    redis.set(`${feed.key}:last`, post.guid, (err) => {
                        if (err) console.log(require("util").inspect(err));
                    });
                }
            });
        }
    }
}

function executeJob(feed) {
    let url = encodeURL(feed.url, feed.querystring);

    let headers = {};

    if (feed.authtype) {
        if (feed.authtype === "twitch") {
            headers["Client-ID"] = config.twitch.client_id;
        }
    }

    if (feed.headers) {
        for (header in feed.headers) {
            headers[header] = feed.headers[header];
        }
    }

    needle.get(url, { headers }, (err, response, body) => {
        if (err || (response && response.statusCode !== 200)) {
            console.error(`something wrong with ${feed.name}.`);
            console.error(err);
            console.error(`status code: ${response ? response.statusCode : "0"}`);
        } else {
            consumeResponse(feed, body);
        }
    });
}

redis.on("ready", () => {
    feeds.forEach((feed) => {
        log(`executing first job ${feed.name}`);
        executeJob(feed);
    });

    feeds.forEach((feed) => {
        log(`subscribing to feed ${feed.name}: ${feed.cron}`);
        jobs[feed.key] = schedule.scheduleJob(feed.cron, function(feed) {
            log(`executing job ${feed.name}`);
            executeJob(feed);
        }.bind(null, feed));
    });
});

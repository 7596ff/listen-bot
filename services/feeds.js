const config = require("../config.json");
const feeds = require("../core/json/feeds.json");

const Redis = require("redis");
const schedule = require("node-schedule");
const needle = require("needle");
const querystring = require("../core/util/query_string");

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
    if (qs) url += querystring(qs);
    return url;
}

async function consumeResponse(feed, body) {
    if (feed.action === "store") {
        redis.set(feed.key, JSON.stringify(body), (err) => {
            err ? console.error(err) : log(`stored feed ${feed.name} in redis`);
        });
    } else if (feed.action === "publish") {
        let post = {};

        if (feed.key === "listen:rss:blog") {
            post.title = body.rss.channel.item[0].title;
            post.link = body.rss.channel.item[0].link;
            post.guid = body.rss.channel.item[0].guid._;
        }

        if (feed.key === "listen:rss:steamnews" && body.appnews.newsitems[0].is_external_url === false) {
            post.title = body.appnews.newsitems[0].title;
            post.link = body.appnews.newsitems[0].url;
            post.guid = body.appnews.newsitems[0].gid;
        }

        if (feed.key === "listen:rss:belvedere" || feed.key === "listen:rss:cyborgmatt") {
            post.title = body.feed.entry[0].title;
            post.link = `https://www.reddit.com${body.feed.entry[0].link.$.href}`;
            post.guid = body.feed.entry[0].id;
        }

        if (post.guid) {
            redis.get(`${feed.key}:last`, (err, reply) => {
                if (err) {
                    console.error(err);
                } else if (reply !== post.guid) {
                    log(`new post found for ${feed.name}, publishing`);
                    redis.publish(feed.key, JSON.stringify(post));
                    redis.set(`${feed.key}:last`, post.guid, (err) => {
                        if (err) console.error(err);
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
        if (err || response.statusCode !== 200) {
            console.error(`something wrong with ${feed.name}. ${err && "err:"}`);
            err && console.error(err);
            response.statsuCode && console.error(`status code: ${response.statusCode}`);
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

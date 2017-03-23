const needle = require("needle");
const Bignumber = require("bignumber.js");

module.exports = (client, url) => {
    return new Promise((resolve, reject) => {
        if (url.endsWith("/")) url = url.slice(0, -1);

        if (url.match("dotabuff.com/players") || url.match("opendota.com/players")) {
            url = url.split("/");
            resolve(url[url.length - 1]);
        }

        if (url.match("steamcommunity.com/")) {
            if (url.match("/profiles/")) {
                url = url.split("/");
                url = url[url.length - 1];
                resolve(new Bignumber(url).minus("76561197960265728"));
            } 

            if (url.match("/id/")) {
                url = url.split("/");
                url = url[url.length - 1];
                let options = {
                    "key": client.config.steam_key,
                    "vanityurl": url
                };

                needle.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/${client.core.util.query_string(options)}`, (err, response) => {
                    let body = response.body.response; // thanks gabe
                    if (body.success == 1) {
                        resolve(new Bignumber(body.steamid).minus("76561197960265728"));
                    } else {
                        reject(body);
                    }
                });
            } else {
                reject("nosteam");
            }
        }
    });
};

const needle = require("needle");
const steamKey = require("../config.json").steam_key;
const queryString = require("./queryString");

function resolveVanityURL(name) {
    return new Promise((resolve, reject) => {
        let options = {
            key: steamKey,
            vanityurl: name
        };

        needle.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/${queryString(options)}`, (err, response) => {
            if (err) reject(err);
            let body = response.body.response; // thanks gabe
            if (!body) reject("what");
            if (body.success == 1) {
                resolve(body.steamid);
            } else {
                reject(body);
            }
        });
    });
}

module.exports = resolveVanityURL;

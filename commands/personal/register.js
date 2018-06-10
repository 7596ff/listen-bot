const Bignumber = require("bignumber.js")
const randomstring = require("randomstring");
const steamconst = "76561197960265728";
const resolveVanityURL = require("../../util/resolveVanityURL");

async function exec(ctx) {
    let search = ctx.options.join(" ");
    let ID = false;

    if (search.includes("dotabuff.com/players") || search.includes("opendota.com/players")) {
        ID = search.split("/").slice(-1)[0];
    }

    if (search.includes("steamcommunity.com/")) {
        let split = search.split("/").reverse();
        ID = split[0] || split[1];

        if (!ID) {
            return ctx.failure(ctx.strings.get("register_no_id"));
        }

        if (isNaN(ID) || search.includes("/id/")) {
            try {
                ID = await resolveVanityURL(ID);
            } catch (err) {
                ctx.error(err);
                return ctx.failure(ctx.strings.get("register_bad_vanity"));
            }
        }

        ID = new Bignumber(ID).minus(steamconst);
    }

    if (!isNaN(search)) {
        ID = search;
    }

    if (!ID || isNaN(ID)) {
        return ctx.failure(ctx.strings.get("register_no_id"));
    }

    let res;
    try {
        res = await ctx.client.mika.getPlayer(ID);
    } catch (err) {
        ctx.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    if (!res.profile) {
        return ctx.failure(ctx.strings.get("register_private_account"));
    }

    if (!res.profile.steamid) {
        return ctx.failure(ctx.strings.get("register_no_steam_id"));
    }

    try {
        ctx.client.redis.publish("steam", JSON.stringify({
            discord_id: ctx.author.id,
            dota_id: res.profile.account_id
        }));

        try { await ctx.message.addReaction("✅") } catch (err) {}

        return Promise.resolve();
    } catch (err) {
        if (err.response && JSON.parse(err.response).code === 50007) {
            return ctx.failure(ctx.strings.get("bot_register_error"));
        } else {
            ctx.error(err);
            return ctx.failure(ctx.strings.get("bot_generic_error"));
        }
    }
}

module.exports = {
    name: "register",
    category: "personal",
    exec
};

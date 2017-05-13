const Bignumber = require("bignumber.js")
const randomstring = require("randomstring");
const steamconst = "76561197960265728";
const resolveVanityURL = require("../../util/resolveVanityURL");

async function exec(ctx) {
    if (!ctx.client.steam_connected) {
        return ctx.failure(ctx.strings.get("register_steam_down"));
    }

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
                console.error(err);
                return ctx.failure(ctx.strings.get("register_bad_vanity"));
            }
        }

        ID = new Bignumber(ID).minus(steamconst);
    }

    if (ID === false || isNaN(ID)) {
        return ctx.failure(ctx.strings.get("register_no_id"));
    }

    let res;
    try {
        res = await ctx.client.mika.getPlayer(ID);
    } catch (err) {
        console.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }

    if (!res.profile) {
        return ctx.failure(ctx.strings.get("register_private_account"));
    }

    if (!res.profile.steamid) {
        return ctx.failure(ctx.strings.get("register_no_steam_id"));
    }

    try {
        let rand = randomstring.generate(6);
        await ctx.client.redis.setexAsync(`register:${res.profile.steamid}`, 900, `${rand}:${ctx.author.id}`);

        ctx.client.redis.publish("discord", JSON.stringify({
            code: 3,
            message: "registering a user",
            steam_id: res.profile.steamid
        }));

        let channel = await ctx.author.getDMChannel();
        await channel.createMessage(ctx.strings.all("register_dm", "\n", rand, ctx.client.config.steam_acc_url));
        try { await ctx.message.addReaction("✅") } catch (err) {}
        return Promise.resolve();
    } catch (err) {
        console.error(err);
        return ctx.failure(ctx.strings.get("bot_generic_error"));
    }
}

module.exports = {
    name: "register",
    category: "personal",
    exec
};

const Bignumber = require("bignumber.js")
const randomstring = require("randomstring");
const steamconst = "76561197960265728";
const resolveVanityURL = require("../../util/resolveVanityURL");

const DM = [
    "Thanks for registering with listen-bot!",
    "Please check your steam friend requests. You should recieve a request from me.",
    "On acceptance, I will prompt you for a code, please send me this: `%randomstring%`",
    "This code is case sensitive and will expire in 10 minutes.",
    "",
    "If you didn't get a friend request, try sending me a request as well: <%url%>"
].join("\n");

async function exec(ctx) {
    if (!ctx.client.steam_connected) {
        return ctx.send("Steam is down or registering is disabled at the moment, sorry about that.");
    }

    let search = ctx.options.join(" ");
    let ID = "no ID";

    if (search.includes("dotabuff.com/players") || search.includes("opendota.com/players")) {
        ID = search.split("/").slice(-1)[0];
    }

    if (search.includes("steamcommunity.com/profiles/")) {
        ID = new Bignumber(search.split("/").slice(-1)[0]).minus(steamconst);
    }

    if (search.includes("steamcommunity.com/id/")) {
        try {
            ID = await resolveVanityURL(search.split("/").slice(-1)[0]);
            ID = new Bignumber(ID).minus(steamconst);
        } catch (err) {
            console.error(err);
            return ctx.send("Couldn't resolve this vanity URL.");
        }
    }

    if (isNaN(ID)) {
        return ctx.send("ID missing or invalid ID provided.");
    }

    let res;
    try {
        res = await ctx.client.mika.getPlayer(ID);
    } catch (err) {
        console.error(err);
        return ctx.send("Something went wrong, and the error has been logged.");
    }

    if (!res.profile) {
        return ctx.send("This steam account is private, or hasn't signed up for OpenDota yet! I can't register it.");
    }

    if (!res.profile.steamid) {
        return ctx.send("I couldn't find a steam ID associated with this user!");
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
        let txt = DM.replace(/%randomstring%/g, rand).replace(/%url%/g, ctx.client.config.steam_acc_url);
        return channel.createMessage(txt);
    } catch (err) {
        console.error(err);
        return ctx.send("Something went wrong, and the error has been logged.");
    }
}

module.exports = {
    name: "register",
    category: "personal",
    exec
} 
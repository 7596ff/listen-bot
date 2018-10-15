const findHero = require("../../util/findHero");
const patchEmbed = require("../../embeds/patch");
const Watcher = require("../../classes/watcher");

const dc = require("dotaconstants");
const versions = Object.keys(dc.patchnotes);
const heroChanges = Object.values(dc.patchnotes).map((version) => version.heroes);

async function exec(ctx) {
    let hero = findHero(ctx.options.join(" "));
    if (!hero) {
        return ctx.failure(ctx.strings.get("bot_no_hero_error"));
    }

    let changes = heroChanges
        .map((change, index) => {
            return {
                version: versions[index].replace("_", "."),
                changes: change[hero.name]
            };
        })
        .filter((change) => change.changes)
        .reverse();

    let notes = changes.map((change) => {
        return {
            content: ctx.strings.all("patch_message", "\n", hero.local, changes.map((change => change.version)).join(" ")),
            embed: patchEmbed(change.changes, hero, change.version)
        }
    });

    let msg = await ctx.send(notes[0]);
    ctx.client.watchers[msg.id] = new Watcher(ctx.client, msg, ctx.author.id, "p/n", notes, 0);
    return Promise.resolve();
}

module.exports = {
    name: "patch",
    category: "static",
    triviaCheat: true,
    exec
};

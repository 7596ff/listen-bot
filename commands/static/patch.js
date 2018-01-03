const findHero = require("../../util/findHero");
const patch = require("../../json/patch.json");
const patchEmbed = require("../../embeds/patch");
const Watcher = require("../../classes/watcher");

async function exec(ctx) {
    let hero = findHero(ctx.options.join(" "));
    if (!hero) {
        return ctx.failure(ctx.strings.get("bot_no_hero_error"));
    }

    let changes = patch.filter((v) => v.heroes[hero.name]);
    let versions = changes.map((v) => v.version);
    let notes = changes
        .map((v) => v.heroes[hero.name])
        .map((notes, index) => {
            return {
                content: ctx.strings.all("patch_message", "\n", hero.local, versions.join(", ")),
                embed: patchEmbed(notes, versions[index])
            };
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

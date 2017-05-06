const upsertMmr = require("../../util/upsertMmr");
const searchMembers = require("../../util/searchMembers");
const allMmrEmbed = require("../../embeds/allMmr");
const singleMmrEmbed = require("../../embeds/singleMmr");

async function all(ctx) {
    let msg = false;
    try {
        msg = await ctx.send("Gathering MMR data. This could take a while.");

        let res = await ctx.client.pg.query("SELECT * FROM public.users;");
        let rows = res.rows.filter((row) => ctx.guild.members.get(row.id));

        let queries = rows.map((row) => upsertMmr(ctx.client.pg, ctx.client.mika, row, false));
        let results = await Promise.all(queries);

        results = results
            .sort((a, b) => (b.scr || 0) - (a.scr || 0))
            .slice(0, 15);

        let embed = allMmrEmbed(results, ctx.guild.members, ctx.guild.name);
        return msg.edit({ embed });
    } catch (err) {
        console.error(err);
        if (msg) return msg.edit("Something went wrong.");
        return ctx.send("Something went wrong.");
    }
}

async function exec(ctx) {
    if (ctx.options[0] === "all") return all(ctx);

    try {
        let ID = ctx.author.id;
        if (ctx.options.length) {
            let members = await searchMembers(ctx.guild.members, ctx.options);
            if (!members.found) return ctx.send("Couldn't find a member!");
            ID = members.all[0];
        }

        let member = ctx.guild.members.get(ID);
        let res = await ctx.client.pg.query({
            "text": "SELECT * FROM public.users WHERE id = $1;",
            "values": [ID]
        });
        
        if (!res.rows.length) {
            return ctx.send(`${member.username} has not registered with me yet! Try \`${ctx.gcfg.prefix}help register\`.`);
        }

        let upserted = await upsertMmr(ctx.client.pg, ctx.client.mika, res.rows[0], true);
        upserted.member = member;

        let embed = singleMmrEmbed(upserted);
        return ctx.embed(embed);
    } catch (err) {
        console.error(err);
        return ctx.send("Something went wrong.");
    }
}

module.exports = {
    name: "mmr",
    category: "personal",
    typing: true,
    exec
};

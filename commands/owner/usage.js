async function exec(ctx) {
    let commands = [];

    for (name in ctx.client.commands) {
        commands.push({
            name,
            category: ctx.client.commands[name].category,
            usage: ctx.client.all_usage.stats[name]
        });
    }

    let categories = commands
        .map((command) => command.category)
        .filter((item, index, array) => array.indexOf(item) === index);

    let rows = [];

    categories.forEach((category) => {
        let row = commands
            .filter((command) => command.category == category)
            .map((command) => `\`${command.name}\`: ${command.usage || 0}`)
            .join(", ");

        rows.push(`**${category}:** ${row}`);
    });

    return ctx.send(`**All:** ${ctx.client.all_usage.stats.all}\n${rows.join("\n")}`);
}

module.exports = {
    name: "usage",
    category: "owner",
    exec
};

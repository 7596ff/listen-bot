module.exports = (client) => {
    let shard_info_list = [`\`\`\`groovy\nShards: ${client.shards.size}`];
    let users = new Array(client.shards.size).fill(0);
    let guilds = new Array(client.shards.size).fill(0);
    client.guilds.forEach(guild => {
        users[guild.shard.id] += guild.members.size;
        guilds[guild.shard.id] += 1;
    });
    client.shards.forEach(shard => {
        shard_info_list.push(`Shard ${shard.id}: ${guilds[shard.id]} guilds, ${users[shard.id]} users, ${shard.latency} ms`);
    });
    shard_info_list.push("```");
    return shard_info_list.join("\n");
};

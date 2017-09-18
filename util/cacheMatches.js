async function cacheMatches(redis, mika, row) {
    let key = `listen:playermatches:${row.dotaid}`;

    let reply = await redis.getAsync(key);
    if (reply) return {
        id: row.id,
        dotaid: row.dotaid,
        data: JSON.parse(reply)
    };

    let matches = await mika.getPlayerMatches(row.dotaid, { included_account_id: row.dotaid });
    await redis.setexAsync(key, 3600, JSON.stringify(matches));
    return {
        id: row.id,
        dotaid: row.dotaid,
        data: matches
    };
}

module.exports = cacheMatches;

async function fixupSubs(pg) {
    await pg.query("ALTER TABLE subs RENAME TO subsold;");
    await pg.query([
        "CREATE TABLE subs (",
        "  owner BIGINT NOT NULL,",
        "  channel BIGINT NOT NULL,",
        "  type TEXT NOT NULL,",
        "  value TEXT NOT NULL,",
        "  CONSTRAINT subs_const unique (owner,channel,type,value)",
        ");"
    ].join(" "));
    let old = await pg.query("SELECT * FROM subsold;");
    let promises = old.rows.map((row) => pg.query({
        text: "INSERT INTO subs VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;",
        values: [row.owner, row.channel, row.type, row.value]
    }));
    let results = await Promise.all(promises);
    return Promise.resolve(results.length);
}

module.exports = fixupSubs;

module.exports = (pg) => {
    let q = [
        "CREATE TABLE subs (",
        "mess TEXT NOT NULL,",
        "owner BIGINT NOT NULL,",
        "channel BIGINT NOT NULL,",
        "type TEXT NOT NULL,",
        "value TEXT NOT NULL,",
        "PRIMARY KEY (mess)",
        ");"
    ].join(" ");

    return pg.query(q);
};

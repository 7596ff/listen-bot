module.exports = (pg) => {
    let q = [
        "CREATE TABLE subs (",
        "date BIGINT NOT NULL,",
        "owner BIGINT NOT NULL,",
        "channelid BIGINT NOT NULL,",
        "dotaid INT,",
        "teamid INT,",
        "leagueid INT,",
        "PRIMARY KEY (date)",
        ");"
    ].join(" ");

    return pg.query(q);
};

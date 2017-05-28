module.exports = (pg) => {
    return pg.query([
        "ALTER TABLE guilds ALTER COLUMN trivia SET DEFAULT 0;",
        "ALTER TABLE guilds ALTER COLUMN prefix SET DEFAULT '--';",
        "ALTER TABLE guilds ALTER COLUMN climit SET DEFAULT 0;",
        "ALTER TABLE guilds ALTER COLUMN mlimit SET DEFAULT 0;",
        "ALTER TABLE guilds ALTER COLUMN locale SET DEFAULT 'en';",
        "ALTER TABLE guilds ALTER COLUMN botspam SET DEFAULT 0;",
        "UPDATE guilds SET trivia = 0 WHERE trivia IS NULL;",
        "UPDATE guilds SET botspam = 0 WHERE botspam IS NULL;"
    ].join(" "));
}

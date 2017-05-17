module.exports = (pg) => {
    return pg.query("ALTER TABLE guilds ADD COLUMN threshold INT; UPDATE guilds SET threshold = 5;");
};

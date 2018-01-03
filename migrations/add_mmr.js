function add_mmr(pg) {
    return pg.query("ALTER TABLE users ADD scr INT, ADD cr INT, ADD sat TEXT;");
}

module.exports = add_mmr;

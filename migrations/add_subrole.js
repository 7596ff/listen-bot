module.exports = (pg) => {
    return pg.query("alter table guilds add column subrole bigint default 0; create unique index subrole_index on subs (owner, type, value)");
}
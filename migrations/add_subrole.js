module.exports = (pg) => {
    return pg.query("alter table guilds add column subrole bigint default 0;");
}
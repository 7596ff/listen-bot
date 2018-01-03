module.exports = (pg) => {
    return pg.query("ALTER TABLE public.guilds ALTER COLUMN locale TYPE text;");
}
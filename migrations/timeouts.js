module.exports = (client) => {
    client.pg.query("SELECT * FROM guilds;").then(res => {
        res.rows.forEach(row => {
            if (row.climit != 0 || row.mlimit != 0) {
                client.pg.query({
                    "text": "UPDATE guilds SET climit = $1, mlimit = $2 WHERE id = $3;",
                    "values": [row.climit / 1000, row.mlimit / 1000, row.id]
                }).then(res => {
                    console.log(row.id);
                })
            }
        })
    });
}

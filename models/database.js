const pgp = require("pg-promise")();
const Database = pgp({
    host: "127.0.0.1",
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

module.exports = Database;
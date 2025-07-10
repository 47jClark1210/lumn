const { Pool} = require('pg');
const pool = new Pool({
    user: 'postgres',
    password: '*47aUaRaX1210*',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'lumn_1898_db'
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};

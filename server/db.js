const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(process.env.DB_CA_PATH).toString(),
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: async () => {
        try {
            await pool.query('SELECT 1');
            console.log('Connected to PostgreSQL');
            return true;
        } catch (err) {
            console.error('Database connection error', err);
            throw err;
        }
    }
};
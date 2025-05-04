require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(process.env.PG_SSL_CA).toString(),
    },
});

// Создание таблицы (если не существует)
async function initDB() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);
        console.log('Database initialized');
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
}

// CRUD API для городов
app.get('/api/cities', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cities ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/cities', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'City name is required' });

    try {
        const result = await pool.query(
            'INSERT INTO cities(name) VALUES($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'City already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/cities/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'City name is required' });

    try {
        const result = await pool.query(
            'UPDATE cities SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/cities/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM cities WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Инициализация и запуск сервера
const PORT = process.env.PORT || 5000;
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
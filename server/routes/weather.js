const express = require('express');
const db = require('../db');
const router = express.Router();

// Получить историю запросов
router.get('/history', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM weather_history ORDER BY timestamp DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Добавить новый запрос в историю
// В POST-роуте /api/weather
router.post('/', async (req, res) => {
    const { city, temp, description } = req.body;

    if (!city || temp === undefined || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await db.query(
            `INSERT INTO weather_history (city, temp, description) 
         VALUES ($1, $2, $3) RETURNING id, city, temp, description, timestamp`,
            [city, temp, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Обновить запись в истории
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { city } = req.body;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const result = await db.query(
            `UPDATE weather_history SET city = $1 
       WHERE id = $2 RETURNING *`,
            [city, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Удалить запись из истории
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            'DELETE FROM weather_history WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
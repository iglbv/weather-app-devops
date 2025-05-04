import pg from 'pg';
import fs from 'fs';
import { City } from '../types/types';

const config = {
    connectionString: "postgres://golubev:6gjs6lie@rc1a-ifib83e5rn7qyi7f.mdb.yandexcloud.net:6432/weather",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("/home/golubev/.postgresql/root.crt").toString(),
    },
};

const pool = new pg.Pool(config);

export const getCities = async (userId: number): Promise<City[]> => {
    const res = await pool.query('SELECT * FROM cities WHERE user_id = $1', [userId]);
    return res.rows;
};

export const addCity = async (name: string, userId: number): Promise<City> => {
    const res = await pool.query(
        'INSERT INTO cities (name, user_id) VALUES ($1, $2) RETURNING *',
        [name, userId]
    );
    return res.rows[0];
};

export const updateCity = async (id: number, newName: string): Promise<City> => {
    const res = await pool.query(
        'UPDATE cities SET name = $1 WHERE id = $2 RETURNING *',
        [newName, id]
    );
    return res.rows[0];
};

export const deleteCity = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM cities WHERE id = $1', [id]);
};
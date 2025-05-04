require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./server/db');
const weatherRoutes = require('./server/routes/weather');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/weather', weatherRoutes);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'dist')));

// All other requests return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
db.connect().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to database', err);
    process.exit(1);
});
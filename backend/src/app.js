const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('MovieKu Backend API is running');
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const historyRoutes = require('./routes/historyRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/stats', statsRoutes);

// app.listen moved to server.js
module.exports = app;

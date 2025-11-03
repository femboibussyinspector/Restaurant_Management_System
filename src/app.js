const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const menuRoutes = require('./Routes/menu.routes');
const authRoutes = require('./Routes/auth.routes');
const errorHandler = require('./middleWares/error.middleware');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/menu', menuRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.use(errorHandler);

module.exports = app;

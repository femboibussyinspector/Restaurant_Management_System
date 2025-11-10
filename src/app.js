const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const tableRoutes = require('./Routes/table.route.js');
// --- ALL YOUR ROUTE IMPORTS ---
const menuRoutes = require('./Routes/menu.routes.js');
const sessionRoutes = require('./Routes/session.Routes.js'); 
const orderRoutes = require('./Routes/order.Routes.js'); 
const authRoutes = require('./Routes/auth.routes.js'); // For Admins
// ---
const errorHandler = require('./middleWares/error.middleware.js');

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

// --- ALL YOUR ROUTES IN USE ---
app.use('/api/v1/auth', authRoutes); // Admin auth (register, login)
app.use('/api/v1/sessions', sessionRoutes); // Table auth (start, end)
app.use('/api/v1/menu', menuRoutes); // Admin menu management
app.use('/api/v1/order', orderRoutes); // Table ordering
app.use('/api/v1/tables', tableRoutes);
// ---

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.use(errorHandler);

module.exports = app;
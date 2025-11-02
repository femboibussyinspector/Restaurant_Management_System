const express = require('express')
const cookieparser = require('cookie-parser')
const cors = require('cors')

const menuRoutes = require('./Routes/menu.routes')
const authRoutes = require('./Routes/auth.Routes');
const errorHandler = require('./middleWares/error.middleware')
const app = express()
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
        credentials: true,
    })
);
app.use(express.json({limit: '16kb'}))
app.use(cookieparser())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/menu', menuRoutes)

app.use(errorHandler);
module.exports = app
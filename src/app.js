const express = require('express')
const cookieparser = require('cookie-parser')


const app = express()

app.use(express.json())
app.use(cookieparser)


module.exports = app
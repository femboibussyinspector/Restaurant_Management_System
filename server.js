// server.js
const dotenv = require('dotenv');
dotenv.config(); // Force config to load first

const app = require('./src/app');
const connectdb = require('./src/db/db');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

// Set the JWT Secret Globally accessible via the Express app
// This is the CRUCIAL step that bypasses timing issues.
app.set('ACCESS_TOKEN_SECRET', process.env.ACCESS_TOKEN_SECRET);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 New socket connected: ${socket.id}`);
  socket.on('joinAdminRoom', () => { 
    socket.join('admin');
    console.log(`Admin socket ${socket.id} joined 'admin' room.`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});
connectdb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!", err);
    process.exit(1);
  });
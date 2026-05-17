const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { setIoInstance } = require('./utils/socket');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setIoInstance(io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`AVUC Backend running on http://localhost:${PORT}`);
});

import express from 'express';
import router from './routes/router.js';
import http from 'http';
import { Server as WebSocketServer } from 'socket.io';
import { setupMiddlewares } from './config/middlewares.js';
import { authenticateSocket } from './middlewares/socketAuthMiddleware.js';
import { setupSocket } from './socket/message.socket.js';

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = new WebSocketServer(server, {
  cors: {
    origin: ['http://localhost:3001', 'https://chatgrupal.netlify.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

setupMiddlewares(app, io);

app.use('/app', router);

io.use(authenticateSocket);
setupSocket(io);

server.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});
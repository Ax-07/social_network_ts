import { Server } from 'socket.io';
import http from 'http';
import { registerNotificationHandlers } from './handlers';
import { notificationAuthMiddleware } from './middlewares';

let io: Server;

export const initializeNotificationWebSocket = (server: http.Server) => {
    io = new Server(server, {
    cors: {
      origin: process.env.URL_ORIGIN, // Configurez les origines acceptées ici
      methods: ["GET", "POST"],
    }
  });

  io.use(notificationAuthMiddleware);

  io.on('connection', (socket) => {
    console.log('User connected to notifications:', socket.id);

    registerNotificationHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected from notifications:', socket.id);
    });
  });

  return io;
};

export { io };


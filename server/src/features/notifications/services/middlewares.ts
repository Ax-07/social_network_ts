import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export const notificationAuthMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  const token = socket.handshake.auth.token;

  if (isValidToken(token)) {
    socket.join(token);
    next();
  } else {
    next(new Error("Authentication error"));
  }
};

function isValidToken(token: string | undefined): boolean {
  // Logique d'authentification pour les notifications
  return !!token;
}

import { Server, Socket } from "socket.io";

interface RoomData {
  roomId: string;
  userId: string;
  message: string;
}

export const configureSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Un utilisateur est connecté");

    // Définir le nom de l'utilisateur
    socket.on("setUser", (data: { userId: string }) => {
      socket.data.userId = data.userId;
      console.log(`Nom de l'utilisateur défini: ${data.userId}`);
    });

    // Rejoindre une salle
    socket.on("joinRoom", (data: RoomData) => {
      const { roomId, userId } = data;
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      socket.to(roomId).emit("userJoined", { userId });
    });

    // Envoyer un message dans la salle
    socket.on("chat message", (data: { roomId: string; message: string }) => {
      const { roomId, message } = data;
      io.to(roomId).emit("chat message", {
        userId: socket.data.userId,
        message,
      });
      console.log(`Message envoyé dans la salle ${roomId}: ${message}`);
    });

    // Envoyer une image ou une vidéo dans la salle
    socket.on("media", (data: { roomId: string; filePath: string }) => {
      const { roomId, filePath } = data;
      io.to(roomId).emit("media", { userId: socket.data.userId, filePath });
      console.log(`Media envoyé dans la salle ${roomId}: ${filePath}`);
    });

    socket.on("disconnect", () => {
      console.log("Un utilisateur est déconnecté");
    });
  });
};

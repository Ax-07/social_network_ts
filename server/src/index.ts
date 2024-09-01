import express, { Request, Response } from "express";
import http from "http";
import { Server } from 'socket.io';
import * as dotenv from "dotenv";
import path from "path";
import routes from "./routes/index.routes";
import db from "./models";
import { configureSocket } from "./services/webSocket";
import serverError from "./utils/errors/server.error";
import { initializeNotificationWebSocket } from './services/notifications';
import { applyServerSecurity } from "./utils/serverSecurity";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuration du serveur WebSocket
configureSocket(io);

// Middleware pour la sécurité du serveur
applyServerSecurity(app);

// Routes statiques pour les images et les vidéos
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
app.use('/videos', express.static(path.join(__dirname, '..', 'public', 'videos')));

// route pour verifier que le serveur fonctionne
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// route pour tester la messagerie instantanée
app.get("/socket", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..','src', 'pages', 'socket.html'));
});

app.use('/api', routes);

app.use(serverError);

// Initialisation des WebSockets
initializeNotificationWebSocket(server);

// Synchronisation de la base de données et lancement du serveur
const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

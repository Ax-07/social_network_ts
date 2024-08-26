import express, { Request, Response } from "express";
import http from "http";
import { Server } from 'socket.io';
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/likes.routes";
import msgRoutes from "./routes/messenging.routes";
import authRoutes from "./routes/auth.routes";
import followRoutes from "./routes/follow.routes";
import db from "./models";
import { configureSocket } from "./services/webSocket";
import serverError from "./utils/errors/server.error";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

configureSocket(io);

app.use(cors());
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
app.use('/videos', express.static(path.join(__dirname, '..', 'public', 'videos')));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.get("/socket", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..','src', 'pages', 'socket.html'));
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use('/api', likeRoutes);
app.use('/api', msgRoutes);
app.use('/api', followRoutes);

app.use(serverError);

// Synchronisation de la base de données et lancement du serveur
const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

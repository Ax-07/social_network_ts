import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import db from "./models";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api", userRoutes);

// Synchronisation de la base de données et lancement du serveur
const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

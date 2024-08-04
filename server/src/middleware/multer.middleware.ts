import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Configuration de stockage en mémoire pour Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fonction pour traiter l'image avec Sharp
const processImage = async (file: Express.Multer.File, host: string): Promise<string> => {
  if (!file) throw new Error("File is undefined");
  const originalName = file.originalname.replace(/\s+/g, '_'); // Remplacer les espaces par des underscores
  const date = new Date().toISOString().replace(/:/g, "-").split("T")[0]; // Date actuelle
  const imagePath = `${date}_${originalName.split(".").slice(0, -1).join("_")}.webp`; // Nom du fichier
  const dbPath = host + "/images/" + imagePath; // Chemin de l'image dans la base de données
  const outputPath = path.join(__dirname, "..", "..", "public", "images", imagePath); // Chemin de l'image sur le disque

  // Traiter l'image avec Sharp et l'enregistrer sur le disque
  await sharp(file.buffer)
    .resize({ width: 800 })
    .webp({ quality: 90 })
    .toFile(outputPath);

  return dbPath;
};

// Fonction pour traiter les vidéos en les enregistrant simplement sur le disque
const processVideo = async (file: Express.Multer.File, host: string): Promise<string> => {
  if (!file) throw new Error("File is undefined");
  const originalName = file.originalname.replace(/\s+/g, '_'); // Remplacer les espaces par des underscores
  const date = new Date().toISOString().replace(/:/g, "-").split("T")[0]; // Date actuelle
  const videoPath = `${date}_${originalName}`;
  const dbPath = host + "/videos/" + videoPath; // Chemin de la vidéo dans la base de données
  const outputPath = path.join(__dirname, "..", "..", "public", "videos", videoPath); // Chemin de la vidéo sur le disque

  console.log("Output Path:", outputPath);

  // Enregistrer la vidéo sur le disque
  fs.writeFileSync(outputPath, file.buffer);

  return dbPath;
};

// Middleware d'upload et de traitement d'image ou de vidéo
const uploadFileMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const host = req.protocol + "://" + req.get("host");

  // Utilisation de upload.any() pour accepter plusieurs fichiers avec différents champs
  upload.any()(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res
        .status(500)
        .json({
          error: "Multer error occurred when uploading.",
          details: err.message,
        });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res
        .status(500)
        .json({
          error: "Unknown error occurred when uploading.",
          details: err.message,
        });
    }

    console.log("Uploaded files:", req.files);

    if (!req.files || req.files.length === 0) {
      return next();
    }

    try {
      const filePromises = (req.files as Express.Multer.File[]).map(
        async (file) => {
          const mimetype = file.mimetype;

          if (
            mimetype === "image/jpeg" ||
            mimetype === "image/png" ||
            mimetype === "image/webp"
          ) {
            return await processImage(file, host);
          } else if (mimetype === "video/mp4" || mimetype === "video/mpeg") {
            return await processVideo(file, host);
          } else {
            throw new Error(
              "Invalid file type. Only JPEG, PNG, WEBP images, and MP4, MPEG videos are allowed."
            );
          }
        }
      );

      const dbPaths = await Promise.all(filePromises); console.log("DB Paths:", dbPaths[0]);
      res.locals.filePath = dbPaths[0]; // Enregistrer les chemins des fichiers dans res.locals
      next();
    } catch (error) {
      console.error("Error processing files:", error);
      return res
        .status(500)
        .json({
          error: "An error occurred while processing the files.",
          details: (error as Error).message,
        });
    }
  });
};

export default uploadFileMiddleware;

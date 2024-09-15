import { Router } from "express";
import authRoutes from "./auth.routes";
import { authRequestLimiter } from "../utils/requestLimiter";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";
import commentRoutes from "./comment.routes";
import likeRoutes from "./likes.routes";
import msgRoutes from "./messenging.routes";
import followRoutes from "./follow.routes";
import notificationRoutes from "./notification.routes";
import messagesRoutes from "./message.routes";

const router = Router();

// Enregistrer toutes les routes sous leurs points d'entrée respectifs
router.use("/auth", authRequestLimiter, authRoutes);
router.use("/", userRoutes);
router.use("/", postRoutes);
router.use("/", commentRoutes);
router.use("/", likeRoutes);
router.use("/", msgRoutes);
router.use("/", followRoutes);
router.use("/", notificationRoutes);
router.use("/", messagesRoutes);

export default router;
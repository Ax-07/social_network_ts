import { Router } from "express";
import { authRequestLimiter } from "../utils/requestLimiter";
import likeRoutes from "../features/likes/likes.routes";
import notificationRoutes from "../features/notifications/notification.routes";
import authRoutes from "../features/auth/auth.routes";
import commentRoutes from "../features/comments/comment.routes";
import followRoutes from "../features/follows/follow.routes";
import postRoutes from "../features/posts/post.routes";
import userRoutes from "../features/user/user.routes";
import messagesRoutes from "../features/messages/message.routes";
import conversationsRoutes from "../features/conversations/conversations.routes";

const router = Router();

// Enregistrer toutes les routes sous leurs points d'entrée respectifs
router.use("/auth", authRequestLimiter, authRoutes);
router.use("/", userRoutes);
router.use("/", postRoutes);
router.use("/", commentRoutes);
router.use("/", likeRoutes);
router.use("/", followRoutes);
router.use("/", notificationRoutes);
router.use("/", messagesRoutes);
router.use("/", conversationsRoutes);

export default router;
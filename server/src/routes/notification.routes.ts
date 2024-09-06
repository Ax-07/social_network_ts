import { Router } from "express";
import { getAllNotificationsByUserId, markNotificationsAsRead } from "../controllers/notification.controller";
import { checkAuth } from "../middleware/checkAuth.middelware";

const router = Router();

router.get('/notifications/:id', checkAuth, getAllNotificationsByUserId);
router.patch('/notifications/:id/markAsRead', checkAuth, markNotificationsAsRead);

export default router;
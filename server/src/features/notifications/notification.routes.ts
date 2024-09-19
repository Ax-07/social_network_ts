import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middelware";
import { getAllNotificationsByUserId, markNotificationsAsRead } from "./controllers/notification.controller";

const router = Router();

router.get('/notifications/:id', checkAuth, getAllNotificationsByUserId);
router.patch('/notifications/:id/markAsRead', checkAuth, markNotificationsAsRead);

export default router;
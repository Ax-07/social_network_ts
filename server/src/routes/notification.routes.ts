import { Router } from "express";
import { getAllNotificationsByUserId } from "../controllers/notification.controller";
import { checkAuth } from "../middleware/checkAuth.middelware";

const router = Router();

router.get('/notifications/:id', checkAuth, getAllNotificationsByUserId);

export default router;
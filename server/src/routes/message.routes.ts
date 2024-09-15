import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.middelware";
import uploadFileMiddleware from "../middleware/multer.middleware";
import { createMessage, getMessagesByRoomId, markMessageAsRead} from "../controllers/messages.controller"

const router = Router();

router.post('/messages', checkAuth, uploadFileMiddleware, createMessage);
router.get('/messages/:roomId', checkAuth, getMessagesByRoomId);
router.patch('/messages/:id/markAsRead', checkAuth, markMessageAsRead);


export default router;
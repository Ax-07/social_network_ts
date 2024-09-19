import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middelware";
import { getConversationsByUserId } from "./controllers/conversation.controller";

const router = Router();

router.get('/conversations/:userId', checkAuth, getConversationsByUserId);

export default router;
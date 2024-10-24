import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middelware";
import uploadFileMiddleware from "../../middleware/multer.middleware";
import { responseToQuestion } from "./controllers/question.controller";

const router = Router();

router.patch('/questions/:id/answers', checkAuth, uploadFileMiddleware, responseToQuestion);

export default router;
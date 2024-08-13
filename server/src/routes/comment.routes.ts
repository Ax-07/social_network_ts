import { Router } from "express";
import { createComment, deleteComment, getAllComments, getCommentById, updateComment } from "../controllers/comment.controller";
import uploadFileMiddleware from "../middleware/multer.middleware";
import { checkAuth } from "../middleware/checkAuth.middelware";

const router = Router();

router.post('/comments', checkAuth, uploadFileMiddleware, createComment);
router.get('/comments', getAllComments);
router.get('/comments/:id', getCommentById);
router.patch('/comments/:id', checkAuth, updateComment);
router.delete('/comments/:id', checkAuth, deleteComment);

export default router;
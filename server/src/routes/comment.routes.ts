import { Router } from "express";
import { createComment, deleteComment, getAllComments, getCommentById, updateComment } from "../controllers/comment.controller";
import uploadFileMiddleware from "../middleware/multer.middleware";

const router = Router();

router.post('/comments', uploadFileMiddleware, createComment);
router.get('/comments', getAllComments);
router.get('/comments/:id', getCommentById);
router.patch('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router;
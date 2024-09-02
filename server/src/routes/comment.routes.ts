import { Router } from "express";
import { createComment, deleteComment, getAllComments, getCommentById, getCommentsByCommentId, getCommentsByPostId, updateComment } from "../controllers/comment.controller";
import uploadFileMiddleware from "../middleware/multer.middleware";
import { checkAuth } from "../middleware/checkAuth.middelware";

const router = Router();

router.post('/comments', checkAuth, uploadFileMiddleware, createComment);
router.get('/comments', getAllComments);
router.get('/posts/comments/:postId', getCommentsByPostId);
router.get('/comments/comments/:commentId', getCommentsByCommentId);
router.get('/comment/:id', getCommentById);
router.patch('/comments/:id', checkAuth, updateComment);
router.delete('/comments/:id', checkAuth, deleteComment);

export default router;
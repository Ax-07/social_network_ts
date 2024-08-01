import { Router } from "express";
import { createComment, deleteComment, getAllComments, getCommentById, updateComment } from "../controllers/comment.controller";

const router = Router();

router.post('/comments', createComment);
router.get('/comments', getAllComments);
router.get('/comments/:id', getCommentById);
router.patch('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router;
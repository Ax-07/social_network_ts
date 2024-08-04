import { Router } from "express";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller";
import uploadFileMiddleware from "../middleware/multer.middleware";

const router = Router();

router.post('/posts',uploadFileMiddleware, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.patch('/posts/:id',uploadFileMiddleware, updatePost);
router.delete('/posts/:id', deletePost);

export default router;
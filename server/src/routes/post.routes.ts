import { Router } from "express";
import { createPost, rePost, deletePost, getAllPosts, getPostById, updatePost, viewPost } from "../controllers/post.controller";
import uploadFileMiddleware from "../middleware/multer.middleware";
import { checkAuth } from "../middleware/checkAuth.middelware";

const router = Router();

router.post('/posts', checkAuth, uploadFileMiddleware, createPost);
router.post('/reposts', checkAuth, uploadFileMiddleware, rePost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.patch('/posts/:id', checkAuth, uploadFileMiddleware, updatePost);
router.delete('/posts/:id', checkAuth, deletePost);
router.post('/posts/views', checkAuth, viewPost);

export default router;
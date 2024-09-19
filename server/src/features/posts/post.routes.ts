import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middelware";
import uploadFileMiddleware from "../../middleware/multer.middleware";
import { createPost, rePost, getAllPosts, getPostById, updatePost, deletePost, viewPost } from "./controllers/post.controller";


const router = Router();

router.post('/posts', checkAuth, uploadFileMiddleware, createPost);
router.post('/reposts', checkAuth, uploadFileMiddleware, rePost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.patch('/posts/:id', checkAuth, uploadFileMiddleware, updatePost);
router.delete('/posts/:id', checkAuth, deletePost);
router.post('/posts/views', checkAuth, viewPost);

export default router;
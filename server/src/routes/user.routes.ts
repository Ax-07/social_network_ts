import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updatePictureProfile, updateCoverPicture, updateUser } from "../controllers/user.controller";
import { addToBookmarks, getBookmarks } from "../controllers/bookmarks.controllers";
import uploadFileMiddleware from "../middleware/multer.middleware";
import { checkAuth } from "../middleware/checkAuth.middelware";

const router = Router();

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', checkAuth, updateUser);
router.patch('/users/:id/profile-picture', checkAuth,uploadFileMiddleware, updatePictureProfile);
router.patch('/users/:id/cover-picture', checkAuth,uploadFileMiddleware, updateCoverPicture);
router.delete('/users/:id', deleteUser);

router.patch('/users/:id/bookmarks', checkAuth, addToBookmarks);
router.get('/users/:id/bookmarks', checkAuth, getBookmarks);

export default router;
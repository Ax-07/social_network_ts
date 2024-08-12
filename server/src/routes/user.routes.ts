import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updatePictureProfile, updateCoverPicture, updateUser } from "../controllers/user.controller";
import { addToBookmarks } from "../controllers/bookmarks.controllers";
import uploadFileMiddleware from "../middleware/multer.middleware";

const router = Router();

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.patch('/users/:id/profile-picture',uploadFileMiddleware, updatePictureProfile);
router.patch('/users/:id/cover-picture',uploadFileMiddleware, updateCoverPicture);
router.delete('/users/:id', deleteUser);

router.patch('/users/:id/bookmarks', addToBookmarks);

export default router;
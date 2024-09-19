import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateCoverPicture, updatePictureProfile, updateUser } from "./controllers/user.controller";
import { checkAuth } from "../../middleware/checkAuth.middelware";
import uploadFileMiddleware from "../../middleware/multer.middleware";
import { addToBookmarks, getBookmarks } from "../bookmarks/controllers/bookmarks.controllers";

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
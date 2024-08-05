import { Router } from "express";
import uploadFileMiddleware from "../middleware/multer.middleware";
import uploadFileMessenging from "../controllers/messenging.controller";

const router = Router();

router.post("/upload", uploadFileMiddleware, uploadFileMessenging);

export default router;

import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { googleLoginCallback, googleRefreshToken } from "../controllers/googleAuth.controller";
import { googleAuthMiddleware } from "../middleware/googleAuth.middleware";

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post('/google/callback', googleAuthMiddleware, googleLoginCallback);
router.post('/google/refresh-token', googleAuthMiddleware, googleRefreshToken);

export default router;
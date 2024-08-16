import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller";
import { googleLoginCallback, googleRefreshToken } from "../controllers/googleAuth.controller";
import { googleAuthMiddleware } from "../middleware/googleAuth.middleware";

const router = Router();

router.post('/register', signUp);
router.post('/login', signIn);

router.post('/google/callback', googleAuthMiddleware, googleLoginCallback);
router.post('/google/refresh-token', googleAuthMiddleware, googleRefreshToken);

export default router;
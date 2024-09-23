import { Router } from "express";
import { googleAuthMiddleware } from "../../middleware/googleAuth.middleware";
import { login, refreshToken, register } from "./controllers/auth.controller";
import { googleLoginCallback, googleRefreshToken } from "./controllers/googleAuth.controller";


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

router.post('/google/callback', googleAuthMiddleware, googleLoginCallback);
router.post('/google/refresh-token', googleAuthMiddleware, googleRefreshToken);

export default router;
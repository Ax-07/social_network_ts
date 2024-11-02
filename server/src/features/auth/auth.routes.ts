import { Router } from "express";
import { googleAuthMiddleware } from "../../middleware/googleAuth.middleware";
import { forgotPassword, login, refreshToken, register, resetPassword } from "./controllers/auth.controller";
import { googleLoginCallback, googleRefreshToken } from "./controllers/googleAuth.controller";


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.post('/google/callback', googleAuthMiddleware, googleLoginCallback);
router.post('/google/refresh-token', googleAuthMiddleware, googleRefreshToken);


export default router;
import { OAuth2Client } from "google-auth-library";
import { Response, NextFunction } from "express";
import { CustomRequest } from '../utils/types/customRequest';
import { apiError } from "../utils/functions/apiResponses";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token: string) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload; // Add this line to return the payload
    } catch (error) {
        throw new Error('Invalid token');
    }
}

const googleAuthMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.body.token || req.body.refreshToken;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const payload = await verifyGoogleToken(token);
        req.user = payload as CustomRequest['user'];
        next();
    } catch (error) {
        return apiError(res, 'Unauthorized', 'Invalid token', 401);
    }
}

export { googleAuthMiddleware }
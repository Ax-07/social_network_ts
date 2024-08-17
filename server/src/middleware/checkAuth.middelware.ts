import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomRequest } from "../utils/types/customRequest";
import { apiError } from "../utils/functions/apiResponses";

const checkAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; console.log("token: ", token);
    if (!token) {
        return apiError(res, 'Unauthorized', 'No token provided', 401);
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;  console.log("decodedToken: ", decodedToken);
        const userId = decodedToken.id; console.log("userId: ", userId);
        req.auth = userId;
        next();
    } catch (error) {
        return apiError(res, 'Unauthorized', 'Invalid token', 401);
    }
}

export { checkAuth }

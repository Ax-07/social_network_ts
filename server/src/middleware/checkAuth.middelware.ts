import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomRequest } from "../utils/types/customRequest";

const checkAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const userId = decodedToken.userId;
        req.auth = userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export { checkAuth }

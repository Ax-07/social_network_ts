import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validateUserEntry from '../utils/functions/validations/validateUserEntry';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';
import generateUsernameFromEmail from '../utils/functions/generateUsernameFromEmail';
import generateUniqueHandle from '../utils/functions/generateUniqueHandle';

const { User } = db;

const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // const errors = validateUserEntry(req.body);
    // if (errors.length > 0) {
    //     return apiError(res, 'Validation error', errors, 400);
    // }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        return apiError(res, 'Email already in use', 400);
    }
    const username = await generateUsernameFromEmail(email);
    const handle = await generateUniqueHandle(username);

    const user = await User.create({ email, password, username, handle}); console.log(user);
    if (!user) {
        return apiError(res, 'User not created', 400);
    }

    try {
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
        return apiSuccess(res, 'User created successfully', { user, accessToken}, 201);
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while creating the user.');
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const errors = validateUserEntry(req.body);
    if (errors.length > 0) {
        return apiError(res, 'Validation error', errors, 400);
    }
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return apiError(res, 'User not found', 404);
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return apiError(res, 'Invalid password', 400);
        }

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
        return apiSuccess(res, 'User logged in successfully', { user, accessToken }, 200);
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while signing in the user.');
    }
}

export { register, login };
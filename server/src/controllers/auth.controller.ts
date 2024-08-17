import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validateUserEntry from '../utils/functions/validateUserEntry';
import generateUniqueHandle from '../utils/functions/generateUniqueHandle';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';

const { User } = db;

const signUp = async (req: Request, res: Response) => {
    const { email, password, username, handle } = req.body;
    const errors = validateUserEntry(req.body);
    if (errors.length > 0) {
        return apiError(res, 'Validation error', errors, 400);
    }
    if (handle) {
        const existingHandle = await User.findOne({ where: { handle } });
        if (existingHandle) {
          return apiError(res, 'Handle already exists', 400);
        }
      }
      const userHandle = handle || await generateUniqueHandle(username);

    try {
        const user = await User.create({ email, password, username, handle: userHandle });
        return apiSuccess(res, 'User created successfully', user, 201);
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while creating the user.');
    }
}

const signIn = async (req: Request, res: Response) => {
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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' }); console.log(token);
        return apiSuccess(res, 'User logged in successfully', { user, token });
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while signing in the user.');
    }
}

export { signUp, signIn };
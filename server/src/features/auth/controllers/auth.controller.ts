import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { handleControllerError } from '../../../utils/errors/controllers.error';
import { apiError, apiSuccess } from '../../../utils/functions/apiResponses';
import generateUniqueHandle from '../../../utils/functions/generateUniqueHandle';
import generateUsernameFromEmail from '../../../utils/functions/generateUsernameFromEmail';
import validateUserEntry from '../../user/validations/validateUserEntry';
import { User } from '../../user/models/user.model';

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
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        return apiSuccess(res, 'User created successfully', { user, accessToken, refreshToken}, 201);
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
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        return apiSuccess(res, 'User logged in successfully', { user, accessToken, refreshToken }, 200);
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while signing in the user.');
    }
}

const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return apiError(res, 'Refresh token is required', 400);
    }
  
    try {
      // Vérifie si le refresh token est valide
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };
  
      // Vérifie si l'utilisateur existe toujours
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return apiError(res, 'User not found', 404);
      }
  
      // Génère un nouveau access token
      const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
  
      return apiSuccess(res, 'Token refreshed successfully', { accessToken: newAccessToken });
    } catch (error) {
      return handleControllerError(res, error, 'Failed to refresh token');
    }
  };

export { register, login, refreshToken };
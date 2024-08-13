import { Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import { CustomRequest } from '../utils/types/customRequest';

const { User } = db;

const googleLoginCallback = async (req: CustomRequest, res: Response) => {
    try {
        const { sub, email, given_name, picture } = req.user!;
        console.log('Google user payload:', req.user);
    
        let user = await User.findOne({ where: { googleId: sub } });
        if (!user) {
          user = await User.create({
            googleId: sub,
            username: given_name,
            email: email,
            profilPicture: picture,
            password: '', // Si vous n'utilisez pas de mot de passe pour les utilisateurs Google
          });
        }
    
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return res.status(200).json({ message: 'User signed in successfully', data: { user, token } });
      } catch (error) {
        handleControllerError(res, error, 'An error occurred while logging in the user.');
      }
    };
    
    export { googleLoginCallback, CustomRequest };
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validateUserEntry from '../utils/functions/validateUserEntry';

const { User } = db;

const signUp = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    const errors = validateUserEntry(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation error', errors });
    }

    try {
        const user = await User.create({ email, password, username });
        return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while creating the user.');
    }
}

const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const errors = validateUserEntry(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation error', errors });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
        return res.status(200).json({ message: 'User signed in successfully', data: { user, token } });
    } catch (error) {
            console.error(error);
        handleControllerError(res, error, 'An error occurred while signing in the user.');
    }
}

export { signUp, signIn };
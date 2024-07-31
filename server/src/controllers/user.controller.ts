import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";

const createUser = async (req: Request, res: Response) => {
const { username, password } = req.body;
try {
    const isExistingUser = await db.User.findOne({ where: { username } });
    if (isExistingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await db.User.create({ username, password, googleId: '' });
    res.status(201).json({ message: 'User registered successfully', user });
} catch (error) {
    handleControllerError(res, error, 'An error occurred while creating the user.');
}
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.User.findAll();
        res.status(200).json(users);
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while getting all users.');
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (user === null) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while getting the user.');
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (user === null) {
            res.status(404).json({ message: 'User not found' });
        } else {
            await user.update(req.body);
            res.status(200).json({ message: 'User updated successfully', user });
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while updating the user.');
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (user === null) {
            res.status(404).json({ message: 'User not found' });
        } else {
            await user.destroy();
            res.status(204).json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while deleting the user.');
    }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
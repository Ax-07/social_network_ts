import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";

const createUser = async (req: Request, res: Response) => {
    try {
        const user = await db.User.create(req.body);
        res.status(201).send(user);
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while creating the user.');
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.User.findAll();
        res.status(200).send(users);
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while getting all users.');
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (user === null) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send(user);
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while getting the user.');
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (user === null) {
            res.status(404).send('User not found');
        } else {
            await user.update(req.body);
            res.status(200).send(user);
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while updating the user.');
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (user === null) {
            res.status(404).send('User not found');
        } else {
            await user.destroy();
            res.status(204).send();
        }
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while deleting the user.');
    }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
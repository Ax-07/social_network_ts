import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import validateUserEntry from "../utils/functions/validateUserEntry";
import {
  deleteCoverPicture,
  deleteProfilPicture,
} from "../utils/functions/deletePicture";

const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const errors = validateUserEntry(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const isExistingUser = await db.User.findOne({ where: { username } });
    if (isExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await db.User.create({ username, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while creating the user."
    );
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while getting all users."
    );
  }
};

const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while getting the user."
    );
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const errors = validateUserEntry(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      res.status(404).json({ message: "User not found" });
    } else {
      await user.update(req.body);
      res.status(200).json({ message: "User updated successfully", user });
    }
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while updating the user."
    );
  }
};

const updatePictureProfile = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const profilPicture = res.locals.filePath;
  if (!profilPicture) {
    return res.status(400).json({ message: "Profile picture is required" });
  }
  const errors = validateUserEntry(profilPicture);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      res.status(404).json({ message: "User not found" });
    } else {
      await user.update({ profilPicture: profilPicture });
      res
        .status(200)
        .json({ message: "Profile picture added successfully", user });
    }
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while adding the profile picture."
    );
  }
};

const updateCoverPicture = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const coverPicture = res.locals.filePath;
  if (!coverPicture) {
    return res.status(400).json({ message: "Cover picture is required" });
  }
  const errors = validateUserEntry(coverPicture);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      res.status(404).json({ message: "User not found" });
    } else {
      await user.update({ coverPicture: coverPicture });
      res
        .status(200)
        .json({ message: "Cover picture added successfully", user });
    }
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while adding the cover picture."
    );
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      res.status(404).json({ message: "User not found" });
    } else {
      await deleteProfilPicture(user.profilPicture);
      await deleteCoverPicture(user.coverPicture);
      await user.destroy();
      res.status(204).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while deleting the user."
    );
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePictureProfile,
  updateCoverPicture,
  deleteUser,
};

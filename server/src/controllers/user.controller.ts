import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import validateUserEntry from "../utils/functions/validations/validateUserEntry";
import { deleteCoverPicture,  deleteProfilPicture } from "../utils/functions/deletePicture";
import { apiError, apiSuccess } from '../utils/functions/apiResponses';

const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const errors = validateUserEntry(req.body);
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }
  try {
    const isExistingUser = await db.User.findOne({ where: { email } });
    if (isExistingUser) {
      return apiError(res, "Username already exist", 400);
    }
    const user = await db.User.create({ email, password });
    return apiSuccess(res, "User created successfully", user, 201);
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while creating the user.");
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.User.findAll();
    return apiSuccess(res, "All users", users);
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while getting all users.");
  }
};

const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return apiError(res, "User ID is required", 400);
  }
  try {
    const user = await db.User.findByPk(userId, {
      include: [
        {
          model: db.User, // Inclure les utilisateurs qui suivent cet utilisateur
          as: 'followers', // Alias défini dans l'association belongsToMany pour followers
          through: { attributes: [] }, // Ignorer les attributs de la table de jonction
          attributes: ['id', 'username', 'profilPicture'], // Sélectionner les informations nécessaires des followers
        },
        {
          model: db.User, // Inclure les utilisateurs que cet utilisateur suit
          as: 'followings', // Alias défini dans l'association belongsToMany pour followings
          through: { attributes: [] },
          attributes: ['id', 'username', 'profilPicture'],
        },
        {
          model: db.Post, // Inclure les posts ajoutés en favoris
          as: 'bookmarks', // Alias défini dans l'association belongsToMany pour bookmarks
          through: { attributes: [] }, // Ignorer les champs de la table de jonction
          attributes:[['id', 'postId']] // Sélectionner les identifiants des posts en utilisant un alias 
        }
      ]
    });
    if (user === null) {
      return apiError(res, "User not found", 404);
    } else {
      return apiSuccess(res, `User ${userId} found`, user);
    }
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while getting the user.");
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return apiError(res, "User ID is required", 400);
  }
  const errors = validateUserEntry(req.body);
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      return apiError(res, "User not found", 404);
    } else {
      await user.update(req.body);
      return apiSuccess(res, `User ${userId} updated successfully`, user);
    }
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while updating the user.");
  }
};

const updatePictureProfile = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return apiError(res, "User ID is required", 400);
  }
  const profilPicture = res.locals.filePath;
  if (!profilPicture) {
    return apiError(res, "Profile picture is required", 400);
  }
  const errors = validateUserEntry(profilPicture);
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      return apiError(res, "User not found", 404);
    } else {
      await user.update({ profilPicture: profilPicture });
      return apiSuccess(res, "Profile picture added successfully", user);
    }
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while adding the profile picture.");
  }
};

const updateCoverPicture = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return apiError(res, "User ID is required", 400);
  }
  const coverPicture = res.locals.filePath;
  if (!coverPicture) {
    return apiError(res, "Cover picture is required", 400);
  }
  const errors = validateUserEntry(coverPicture);
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      return apiError(res, "User not found", 404);
    } else {
      await user.update({ coverPicture: coverPicture });
      return apiSuccess(res, "Cover picture added successfully", user);
    }
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while adding the cover picture.");
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return apiError(res, "User ID is required", 400);
  }
  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      res.status(404).json({ message: "User not found" });
    } else {
      await deleteProfilPicture(user.profilPicture);
      await deleteCoverPicture(user.coverPicture);
      await user.destroy();
      return apiSuccess(res, `User ${userId} deleted successfully`, { id: userId });
    }
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while deleting the user.");
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

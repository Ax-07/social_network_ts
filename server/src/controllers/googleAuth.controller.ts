import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import { CustomRequest } from "../utils/types/customRequest";
import generateUniqueHandle from "../utils/functions/generateUniqueHandle";
import { User as UserType } from "../models/users/user.model";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";

const { User } = db;

const generateToken = (user: UserType) => {
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const googleLoginCallback = async (req: CustomRequest, res: Response) => {
  try {
    const { sub, email, given_name } = req.user!;
    let handle;
    if (handle) {
      const existingHandle = await User.findOne({ where: { handle } });
      if (existingHandle) {
        return apiError(res, "Handle already exists", 400);
      }
    }
    const userHandle = handle || (await generateUniqueHandle(given_name));

    let user = await User.findOne({ where: { googleId: sub } });
    if (!user) {
      user = await User.create({
        googleId: sub,
        username: given_name,
        handle: userHandle,
        email: email,
        password: "", // Si vous n'utilisez pas de mot de passe pour les utilisateurs Google
      });
      const { accessToken, refreshToken } = generateToken(user);
      return apiSuccess(res, "User created successfully", {
        user,
        accessToken,
        refreshToken,
      }, 201);
    }

    const { accessToken, refreshToken } = generateToken(user);
    return apiSuccess(res, "User logged in successfully", {
      user,
      accessToken,
      refreshToken,
    }, 200);
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while logging in the user.");
  }
};

const googleRefreshToken = async (req: CustomRequest, res: Response) => {
  const {refreshToken} = req.body;
  if (!refreshToken) {
    return apiError(res, "Refresh token is required", 403);
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload;

  // Vérifiez le refresh token
  try {
    const accessToken = jwt.sign({ id: decoded.sub }, "access-token-secret", {
      expiresIn: "15m",
    }); console.log("accessToken: ", accessToken);

    return apiSuccess(res, "Token refreshed successfully", { accessToken }, 200);
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while refreshing the token.");
  }
};

export { googleLoginCallback, googleRefreshToken, CustomRequest };

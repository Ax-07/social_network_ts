import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import { CustomRequest } from "../utils/types/customRequest";
import generateUniqueHandle from "../utils/functions/generateUniqueHandle";
import { User as UserType } from "../models/user.model";

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
    const { sub, email, given_name, picture } = req.user!;
    console.log("Google user payload:", req.user);

    let handle;
    if (handle) {
      const existingHandle = await User.findOne({ where: { handle } });
      if (existingHandle) {
        return res.status(400).json({ error: "Handle already taken" });
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
        profilPicture: "",
        password: "", // Si vous n'utilisez pas de mot de passe pour les utilisateurs Google
      });
    }

    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' }); console.log(token);
    const { accessToken, refreshToken } = generateToken(user);
    return res
      .status(200)
      .json({
        message: "User signed in successfully",
        data: { user, accessToken, refreshToken },
      });
  } catch (error) {
    handleControllerError(
      res,
      error,
      "An error occurred while logging in the user."
    );
  }
};

const googleRefreshToken = async (req: CustomRequest, res: Response) => {
  const {refreshToken} = req.body; console.log("refreshToken: ", refreshToken);
  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided" });
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload; console.log("decoded: ", decoded);

  // Vérifiez le refresh token
  try {
   // const user = { id: decoded.sub }; console.log(user) // Logique pour retrouver l'utilisateur
    const user = decoded.id; console.log("user: ", user);
    const accessToken = jwt.sign({ id: decoded.sub }, "access-token-secret", {
      expiresIn: "15m",
    }); console.log("accessToken: ", accessToken);

    return res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export { googleLoginCallback, googleRefreshToken, CustomRequest };

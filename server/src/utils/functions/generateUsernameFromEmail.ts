import { User } from "../../models/users/user.model";

const generateUsernameFromEmail = async (email: string): Promise<string> => {
  const username = email.split("@")[0];
  let existingUser = await User.findOne({ where: { username } });
  let suffix = 1;

  while (existingUser) {
    existingUser = await User.findOne({
      where: { username: `${username}${suffix}` },
    });
    suffix++;
  }

  return username;
};

export default generateUsernameFromEmail;

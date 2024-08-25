import { User } from "../../models/user.model";

// Générer un handle unique
const generateUniqueHandle = async (username: string): Promise<string> => {
  let handle = "@"+username.charAt(0).toUpperCase() + username.slice(1).toLowerCase().replace(/\s+/g, '');
  let existingUser = await User.findOne({ where: { handle } });
  let suffix = 1;

  while (existingUser) {
    handle = `${"@"+username.charAt(0).toUpperCase() + username.slice(1).toLowerCase().replace(/\s+/g, '')}${suffix}`;
    existingUser = await User.findOne({ where: { handle } });
    suffix++;
  }

  return handle;
};

export default generateUniqueHandle;
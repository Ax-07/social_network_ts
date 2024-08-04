import fs from "fs";
import path from "path";

const baseURL = "http://localhost:8080";

const getLocalFilePath = (url: string) => {
  const localPath = url.replace(
    baseURL,
    path.join(__dirname,"..", "..", "..", "public")
);
console.log("Local path:", localPath);
  return localPath;
};

const deleteProfilPicture = async (filePath: string): Promise<void> => {
  const profilePicturePath = filePath ? getLocalFilePath(filePath) : null; console.log('Profile Picture Path:', profilePicturePath);
  if (profilePicturePath && fs.existsSync(profilePicturePath)) {
    fs.unlink(profilePicturePath, (err) => {
      if (err) {
        console.error("Error deleting profile picture:", err);
      } else {
        console.log("Profile picture deleted successfully");
      }
    });
  }
};

const deleteCoverPicture = async (filePath: string): Promise<void> => {
    const coverPicturePath = filePath ? getLocalFilePath(filePath) : null; console.log('Cover Picture Path:', coverPicturePath);
    if (coverPicturePath && fs.existsSync(coverPicturePath)) {
        fs.unlink(coverPicturePath, (err) => {
            if (err) {
                console.error('Error deleting cover picture:', err);
            } else {
                console.log('Cover picture deleted successfully');
            }
        });
    }
};

export { deleteProfilPicture, deleteCoverPicture };
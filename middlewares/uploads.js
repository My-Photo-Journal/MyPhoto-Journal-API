import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

export const photoImageUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/My-Photo-Journal/photos/*'
    }),

preservePath: true
});

export const userAvatarUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/My-Photo-Journal/users/*'
    }),
    preservePath: true
});
import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

export const photoImageUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/My-Photo-Journal/photos/*'
    }),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    preservePath: true
});

export const userAvatarUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/My-Photo-Journal/users/*'
    }),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    preservePath: true
});
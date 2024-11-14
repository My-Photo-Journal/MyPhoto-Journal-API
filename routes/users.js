import { Router } from "express";
import {registerUser, loginUser, getProfile, updateProfile, getUserPhotos, deletePhoto, confirmEmail} from "../controllers/users.js";
import {userAvatarUpload} from "../middlewares/uploads.js";
import {isAuthenticated, hasPermission} from "../middlewares/auth.js";


const userRouter = Router();

userRouter.post('/users/register',userAvatarUpload.single('avatar'), registerUser);

userRouter.post('/users/login', loginUser);

userRouter.get('/users/me', isAuthenticated, getProfile);

userRouter.get('/users/me/photos', isAuthenticated, getUserPhotos);

userRouter.patch('/users/me', isAuthenticated, hasPermission('update_profile'), userAvatarUpload.single('avatar'), updateProfile);

userRouter.delete('/users/me/photos/:photoId', isAuthenticated, hasPermission('delete_photo'), deletePhoto)

userRouter.get('/confirm/:token', confirmEmail);

export default userRouter;

import { Router } from "express";
import {registerUser, loginUser, getProfile, updateProfile, getUserPhotos, deletePhoto} from "../controllers/users.js";
import {userAvatarUpload} from "../middlewares/uploads.js";
import {isAuthenticated, hasPermission} from "../middlewares/auth.js";


const userRouter = Router();

userRouter.post('/users/register', registerUser);

userRouter.post('/users/login', loginUser);

userRouter.get('/users/me', isAuthenticated, getProfile);

userRouter.get('/users/me/photos', isAuthenticated, getUserPhotos);

userRouter.patch('/users/me', isAuthenticated, hasPermission('update_profile'), userAvatarUpload.single('avatar'), updateProfile);

userRouter.delete('/users/me', isAuthenticated, hasPermission('delete_profile'), userAvatarUpload.single('avatar'), deletePhoto)

export default userRouter;

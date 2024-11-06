import { Router } from "express";
import {addPhoto, getPhoto, getPhotos, updatePhoto, deletePhoto, countPhotos} from "../controllers/photos.js";
import {photoImageUpload} from "../middlewares/uploads.js";
import {isAuthenticated, hasPermission} from "../middlewares/auth.js";


const photoRouter = Router();

photoRouter.get('/photos/count', countPhotos)

photoRouter.post('/photos', isAuthenticated, hasPermission('add_photo'), photoImageUpload.single('image'), addPhoto);

photoRouter.get('/photos', getPhotos);

photoRouter.get('/adverts/:id', getPhoto)

photoRouter.patch('/adverts/:id', isAuthenticated, hasPermission('update_photo'),photoImageUpload.single('image'), updatePhoto);

photoRouter.delete('/photos/:id', isAuthenticated, hasPermission('delete_photo'), deletePhoto);

export default photoRouter;


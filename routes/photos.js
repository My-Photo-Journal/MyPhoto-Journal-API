import { Router } from "express";
import { addPhotos, getPhoto, getPhotos, updatePhoto, deletePhoto, countPhotos, favoritePhoto, unfavoritePhoto, getFavoritePhotos } from "../controllers/photos.js";
import { photoImageUpload } from "../middlewares/uploads.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";


const photoRouter = Router();

photoRouter.get('/photos/count', countPhotos)

photoRouter.post('/photos', isAuthenticated, hasPermission('add_photo'), photoImageUpload.array('images', 10), addPhotos);

photoRouter.get('/photos', getPhotos);

photoRouter.get('/photos/:id', getPhoto)

photoRouter.patch('/photos/:id', isAuthenticated, hasPermission('update_photo'), photoImageUpload.single('image'), updatePhoto);

photoRouter.delete('/photos/:id', isAuthenticated, hasPermission('delete_photo'), deletePhoto);

photoRouter.post('/photos/:id/favorite', isAuthenticated, favoritePhoto);
photoRouter.delete('/photos/:id/favorite', isAuthenticated, unfavoritePhoto);
photoRouter.get('/photos/favorites', isAuthenticated, getFavoritePhotos);

export default photoRouter;
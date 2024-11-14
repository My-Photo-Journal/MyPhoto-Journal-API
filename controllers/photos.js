import { PhotoModel } from "../models/photos.js";
import { addPhotoValidator, updatePhotoValidator } from "../validators/photos.js";


export const addPhoto = async (req, res, next) => {
    try {
        console.log("request body-->", req.body)
        const { error, value } = addPhotoValidator.validate({
            ...req.body,
            image: req.file?.filename,
        })
        if (error) {
            return res.status(422).json(error);
        }
        await PhotoModel.create({
            ...value,
            user: req.auth.id
        });
        res.status(201).json('Photo was Added');

    } catch (error) {
        next(error);
    }
};


export const getPhotos = async (req, res, next) => {
    try {
        const { title, category, limit = 10, skip = 0, sort = "{}" } = req.query;
        let filter = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        const photos = await PhotoModel
            .find(filter)
            .sort(JSON.parse(sort))
            .limit(Number(limit))
            .skip(Number(skip));
        res.status(200).json(photos);
    } catch (error) {
        next(error);
    }
};


export const countPhotos = async (req, res, next) => {
    try {
        const { title, category } = req.query;
        let filter = {};
        
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }

        const count = await PhotoModel.countDocuments(filter);
        res.json({ count });
    } catch (error) {
        next(error);
    }
};


export const getPhoto = async (req, res, next) => {
    try {
        const { error, value } = photoIdValidator.validate({ id: req.params.id });
        if (error) {
            return res.status(422).json(error);
        }
        
        const photo = await PhotoModel.findById(value.id);
        if (!photo) {
            return res.status(404).json({
                status: 'error',
                message: 'Photo not found'
            });
        }
        res.json(photo);
    } catch (error) {
        next(error);
    }
};


export const updatePhoto = async (req, res, next) => {
    try {
        const { error, value } = updatePhotoValidator.validate({
            ...req.body,
            image: req.file?.filename
        });
        if (error) {
            return res.status(422).json(error);
        }
        
        const photo = await PhotoModel.findOneAndUpdate(
            { 
                _id: req.params.id,
                user: req.auth.id  // Ensure user owns the photo
            },
            value,
            { new: true }
        );

        if (!photo) {
            return res.status(404).json({
                status: 'error',
                message: 'Photo not found or unauthorized'
            });
        }

        res.json({
            status: 'success',
            message: 'Photo updated successfully',
            photo
        });
    } catch (error) {
        next(error);
    }
};



export const deletePhoto = async (req, res, next) => {
    try {
        const photo = await PhotoModel.findOneAndDelete({
            _id: req.params.id,
            user: req.auth.id  // Ensure user owns the photo
        });

        if (!photo) {
            return res.status(404).json({
                status: 'error',
                message: 'Photo not found or unauthorized'
            });
        }

        res.json({
            status: 'success',
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
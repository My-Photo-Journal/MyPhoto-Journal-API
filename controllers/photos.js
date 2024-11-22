import { PhotoModel } from "../models/photos.js";
import { addPhotoValidator, updatePhotoValidator } from "../validators/photos.js";

const formatPhotoResponse = (photo) => ({
    id: photo._id,
    title: photo.title,
    description: photo.description,
    image: photo.image,
    event: photo.event,
    user: photo.user,
    favorites: photo.favorites?.length || 0,
    isFavorited: photo.favorites?.includes(req?.auth?.id) || false,
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt
});

export const addPhotos = async (req, res, next) => {
    try {
        console.log("Request file:", req.file);
        
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No image file provided. Please upload an image file.'
            });
        }

        const { error, value } = addPhotoValidator.validate({
            ...req.body,
            image: req.file.filename
        });

        if (error) {
            return res.status(422).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        const photo = await PhotoModel.create({
            ...value,
            user: req.auth.id
        });

        res.status(201).json({
            status: 'success',
            message: 'Photo uploaded successfully',
            data: photo
        });
    } catch (error) {
        next(error);
    }
};


export const getPhotos = async (req, res, next) => {
    try {
        const { title, event, limit = 200, skip = 0, sort = '{"createdAt":-1}' } = req.query;
        let filter = {};

        if (title) {
            filter.$text = { $search: title };
        }
        if (event) {
            filter.event = event;
        }

        const [photos, total] = await Promise.all([
            PhotoModel
                .find(filter)
                .sort(JSON.parse(sort))
                .limit(Number(limit))
                .skip(Number(skip))
                .populate('user', 'firstName lastName')
                .populate('event', 'title'),
            PhotoModel.countDocuments(filter)
        ]);

        res.status(200).json({
            status: 'success',
            data: photos.map(formatPhotoResponse),
            pagination: {
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit)
            }
        });
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

export const favoritePhoto = async (req, res, next) => {
    try {
        const photo = await PhotoModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { favorites: req.auth.id } },
            { new: true }
        );

        if (!photo) {
            return res.status(404).json({
                status: 'error',
                message: 'Photo not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Photo added to favorites',
            photo
        });
    } catch (error) {
        next(error);
    }
};

export const unfavoritePhoto = async (req, res, next) => {
    try {
        const photo = await PhotoModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { favorites: req.auth.id } },
            { new: true }
        );

        if (!photo) {
            return res.status(404).json({
                status: 'error',
                message: 'Photo not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Photo removed from favorites',
            photo
        });
    } catch (error) {
        next(error);
    }
};

export const getFavoritePhotos = async (req, res, next) => {
    try {
        const photos = await PhotoModel.find({
            favorites: req.auth.id
        }).populate('user', 'firstName lastName');

        res.json({
            status: 'success',
            data: photos
        });
    } catch (error) {
        next(error);
    }
};
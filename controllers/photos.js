import { PhotoModel } from "../models/photos.js";
import { addPhotoValidator, updatePhotoValidator } from "../validators/photos.js";


export const addPhoto = async (req, res, next) => {
    try {
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
        const { } = req.body;
        const count = await PhotoModel.countDocuments(JSON.parse(filter));
        res.json({ count })
    } catch (error) {
        next(error);
    }
};


export const getPhoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const photo = await PhotoModel.findById(id);
        res.json(advert);
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
        const photo = await PhotoModel.findByIdAndUpdate(req.params.id, value);
        res.json('Photo updated');
    } catch (error) {
        next(error);
    }
};



export const deletePhoto = async (req, res, next) => {
    try {
        await PhotoModel.findByIdAndDelete(req.params.id);
        res.json('Photo deleted successfully');
    } catch (error) {
        next(error);
    }
};
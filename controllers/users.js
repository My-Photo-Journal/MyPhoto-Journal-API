import { registerUserValidator, loginUserValidator, updateProfileValidator, deletePhotoValidator } from "../validators/users.js";
import { UserModel } from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mailTransporter, sendConfirmationEmail } from "../utils/mails.js";
import { PhotoModel } from "../models/photos.js";
import crypto from 'crypto';



export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserValidator.validate({...req.body, avatar: req.file?.filename});
        if (error) {
            return res.status(422).json(error);
        }
        const user = await UserModel.findOne({ email: value.email });
        if (user) {
            return res.status(409).json({
                status: 'error',
                message: 'User already exists!'
            });
        }
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await UserModel.create({
            ...value,
            password: hashedPassword,
            confirmationToken,
            confirmationTokenExpires,
            isConfirmed: false
        });
        await sendConfirmationEmail(value.email, confirmationToken, value.firstName);
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully. Please check your email to confirm your account.'
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User does not exist!'
            });
        }
        if (!user.isConfirmed) {
            return res.status(401).json({
                status: 'error',
                message: 'Please confirm your email before logging in'
            });
        }
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '24h' }
        );
        res.json({
            status: 'success',
            message: 'User logged in successfully',
            data: {
                accessToken: token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await UserModel
            .findById(req.auth.id)
            .select({ password: false });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserPhotos = async (req, res, next) => {
    try {
        const { title, category, limit = 10, skip = 0, sort = "{}" } = req.query;
        let filter = {};
        if (title) {
            filter.title = {
                $regex:
                    title, $options: 'i'};
        }
        if (category) {
            filter.category = category;
        }

        const photos = await PhotoModel
            .find({
                ...filter,
                user: req.auth.id
            })
            .sort(JSON.parse(sort))
            .limit(Number(limit))
            .skip(Number(skip));
        res.status(200).json(photos);
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { error, value } = updateProfileValidator.validate({
            ...req.body,
            avatar: req.file?.filename
        });
        if (error) {
            return res.status(422).json(error);
        }
        await UserModel.findByIdAndUpdate(req.auth.id, value);
        res.json('User Profile updated');
    } catch (error) {
        next(error);
    }
}


export const deletePhoto = async (req, res, next) => {
    try {
        const { error, value } = deletePhotoValidator.validate(req.params);
        if (error) {
            return res.status(422).json(error);
        }
        
        const photo = await PhotoModel.findOneAndDelete({
            _id: value.photoId,
            user: req.auth.id
        });

        if (!photo) {
            return res.status(404).json('Photo not found');
        }

        res.json('Photo deleted successfully');
    } catch (error) {
        next(error);
    }
};

export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        const user = await UserModel.findOne({
            confirmationToken: token,
            confirmationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired confirmation token'
            });
        }

        user.isConfirmed = true;
        user.confirmationToken = undefined;
        user.confirmationTokenExpires = undefined;
        await user.save();

        res.json({
            message: 'Email confirmed successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error confirming email',
            error: error.message
        });
    }
};

import { registerUserValidator, loginUserValidator, updateProfileValidator } from "../validators/users.js";
import { UserModel } from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mailTransporter } from "../utils/mails.js";
import { PhotoModel } from "../models/photos.js";



export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        const user = await UserModel.findOne({ email: value.email });
        if (user) {
            return res.status(409).json('User already exists!');
        }
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        await UserModel.create({
            ...value,
            password: hashedPassword
        });
        await mailTransporter.sendMail({
            to: value.email,
            subject: 'User Registration',
            text: `Hello! ${value.name}, Your account has been successfully registered`
        });
        res.json("User Registered");
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
            return res.status(404).json('User does not exist!');
        }
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json
                ('Invalid Credentials');
        }
        const token = jwt.sign(
            { id: user.id },
            //  since we don't have roles who do i work on this
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '24h' }
        );
        res.json({
            message: 'User logged in!',
            accessToken: token
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
        res.status(200).json(adverts);
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

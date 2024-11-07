import Joi from "joi";

export const registerUserValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required(),
    role: Joi.string().valid('user').default('user')
});


export const loginUserValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


export const updateProfileValidator = Joi.object({
    firstname: Joi.string(),
    lastName: Joi.string(),
    avatar: Joi.string()
});
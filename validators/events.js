import Joi from "joi";

export const addEventValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    date: Joi.date().required(),
    location: Joi.string()
});

export const updateEventValidator = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    date: Joi.date(),
    location: Joi.string()
});

export const eventIdValidator = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});


import Joi from "joi";

export const addPhotoValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    event: Joi.string(),
    image: Joi.string(),
});


export const updatePhotoValidator = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    event: Joi.string(),
    image: Joi.string()
});

export const photoIdValidator = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});


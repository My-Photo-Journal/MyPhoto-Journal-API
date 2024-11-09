import Joi from "joi";

export const addPhotoValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string(),
    image: Joi.string(),
});


export const updatePhotoValidator = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    image: Joi.string()
});


export const deletePhotoValidator = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    image: Joi.string()
});


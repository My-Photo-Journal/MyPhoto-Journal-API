import Joi from "joi";

export const addPhotoValidator = Joi.object({
    title: Joi.string().required().trim().min(3).max(100),
    description: Joi.string().trim().max(500),
    event: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    image: Joi.string().required(),
});

export const updatePhotoValidator = Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().max(500),
    event: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    image: Joi.string()
}).min(1);

export const photoIdValidator = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
        .messages({
            'string.pattern.base': 'Invalid photo ID format'
        })
});


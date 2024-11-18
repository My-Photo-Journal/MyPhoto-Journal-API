import Joi from "joi";

export const addEventValidator = Joi.object({
    title: Joi.string().required().trim().min(3).max(100),
    description: Joi.string().trim().max(500),
    date: Joi.date().required(),
    location: Joi.string().trim().max(200)
});

export const updateEventValidator = Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().max(500),
    date: Joi.date(),
    location: Joi.string().trim().max(200)
}).min(1);

export const eventIdValidator = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
        .messages({
            'string.pattern.base': 'Invalid event ID format'
        })
});


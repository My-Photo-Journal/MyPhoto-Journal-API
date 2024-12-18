import { EventModel } from "../models/events.js";
import { addEventValidator, updateEventValidator, eventIdValidator } from "../validators/events.js";

export const addEvent = async (req, res, next) => {
    try {
        const { error, value } = addEventValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        const event = await EventModel.create({
            ...value,
            user: req.auth.id
        });

        res.status(201).json({
            status: 'success',
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

export const getEvents = async (req, res, next) => {
    try {
        const { title, limit = 10, skip = 0, sort = '{"createdAt":-1}' } = req.query;
        let filter = {};
        
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        const [events, total] = await Promise.all([
            EventModel
                .find(filter)
                .sort(JSON.parse(sort))
                .limit(Number(limit))
                .skip(Number(skip))
                .populate('user', 'firstName lastName'),
            EventModel.countDocuments(filter)
        ]);

        res.status(200).json({
            status: 'success',
            data: events,
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

export const getEvent = async (req, res, next) => {
    try {
        const { error, value } = eventIdValidator.validate({ id: req.params.id });
        if (error) {
            return res.status(422).json(error);
        }

        const event = await EventModel.findById(value.id)
            .populate('user', 'firstName lastName');

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }

        res.json({
            status: 'success',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const { error, value } = updateEventValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        const event = await EventModel.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.auth.id
            },
            value,
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found or unauthorized'
            });
        }

        res.json({
            status: 'success',
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

export const deleteEvent = async (req, res, next) => {
    try {
        const event = await EventModel.findOneAndDelete({
            _id: req.params.id,
            user: req.auth.id
        });

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found or unauthorized'
            });
        }

        res.json({
            status: 'success',
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}; 
import { EventModel } from "../models/events.js";
import { eventIdValidator, addEventValidator, updateEventValidator } from "../validators/events.js";


export const addEvent = async (req, res, next) => {
    try {
        console.log("request body-->", req.body)
        const { error, value } = addEventValidator.validate({
            ...req.body,
        })
        if (error) {
            return res.status(422).json(error);
        }
        await EventModel.create({
            ...value,
            user: req.auth.id
        });
        res.status(201).json('Event was Added');

    } catch (error) {
        next(error);
    }
};


export const getEvents = async (req, res, next) => {
    try {
        const { title, limit = 10, skip = 0, sort = "{}" } = req.query;
        let filter = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        const events = await EventModel
            .find(filter)
            .sort(JSON.parse(sort))
            .limit(Number(limit))
            .skip(Number(skip));
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};


export const countEvents = async (req, res, next) => {
    try {
        const { title, event } = req.query;
        let filter = {};
        
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (event) {
            filter.event = event;
        }

        const count = await EventModel.countDocuments(filter);
        res.json({ count });
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
        
        const event = await EventModel.findById(value.id);
        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }
        res.json(event);
    } catch (error) {
        next(error);
    }
};


export const updateEvent = async (req, res, next) => {
    try {
        const { error, value } = updateEventValidator.validate({
            ...req.body,
        });
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
            event
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
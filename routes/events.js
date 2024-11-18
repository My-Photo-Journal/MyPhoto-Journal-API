import { Router } from "express";
import { addEvent, getEvent, getEvents, updateEvent, deleteEvent } from "../controllers/events.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";

const eventRouter = Router();

eventRouter.post('/events', isAuthenticated, hasPermission('add_event'), addEvent);
eventRouter.get('/events', getEvents);
eventRouter.get('/events/:id', getEvent);
eventRouter.patch('/events/:id', isAuthenticated, hasPermission('update_event'), updateEvent);
eventRouter.delete('/events/:id', isAuthenticated, hasPermission('delete_event'), deleteEvent);

export default eventRouter;


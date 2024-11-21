import { Router } from "express";
import { addEvent, getEvent, getEvents, updateEvent, deleteEvent, getUserEvents } from "../controllers/events.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";

const eventRouter = Router();

// Public routes
eventRouter.get('/events', getEvents);
eventRouter.get('/events/:id', getEvent);

// Protected routes
eventRouter.post('/events', isAuthenticated, hasPermission('add_event'), addEvent);
eventRouter.get('/users/me/events', isAuthenticated, getUserEvents);
eventRouter.patch('/events/:id', isAuthenticated, hasPermission('update_event'), updateEvent);
eventRouter.delete('/events/:id', isAuthenticated, hasPermission('delete_event'), deleteEvent);

export default eventRouter;


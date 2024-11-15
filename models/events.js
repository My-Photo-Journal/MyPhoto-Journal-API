import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
}, {
    timestamps: true,
});

eventSchema.plugin(toJSON);

export const EventModel = model('Event', eventSchema); 
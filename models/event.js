import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    photos:[{type: Schema.Types.ObjectId, required: true, ref: 'Photo' }],

}, {
    timestamps: true,
})

eventSchema.plugin(toJSON);

export const EventModel = model('Event', eventSchema);
import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const photoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    event: { type: Schema.Types.ObjectId, required: true, ref: 'Event' },
    image: { type: String },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }

}, {
    timestamps: true,
});

photoSchema.index({
    title: 'text',
    photo: 'text',

});

photoSchema.plugin(toJSON);

export const PhotoModel = model('Photo', photoSchema);



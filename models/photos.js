import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const photoSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    description: { 
        type: String,
        trim: true,
        maxLength: 500
    },
    event: { 
        type: Schema.Types.ObjectId, 
        ref: 'Event',
        index: true
    },
    image: { 
        type: String, 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User',
        index: true
    },
    favorites: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        index: true
    }]
}, {
    timestamps: true,
});

// Compound indexes for better query performance
photoSchema.index({ title: 'text', description: 'text' });
photoSchema.index({ user: 1, createdAt: -1 });
photoSchema.index({ favorites: 1, createdAt: -1 });

photoSchema.plugin(toJSON);

export const PhotoModel = model('Photo', photoSchema);



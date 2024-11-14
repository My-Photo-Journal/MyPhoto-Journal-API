import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";



const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, default:'user', enum:['user']},
    avatar: {type: String},
    isConfirmed: {
        type: Boolean,
        default: false
    },
    confirmationToken: {
        type: String,
        maxLength: 64
    },
    confirmationTokenExpires: Date

}, {
    timestamps: true,
})

userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);
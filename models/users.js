import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";



const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unque: true },
    password: { type: String, required: true },
    // confirmPassword: { type: String, required: true },
    role: {type: String, default:'user', enum:['user']},

}, {
    timestamps: true,
})

userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);
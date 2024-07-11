import mongoose from "mongoose";
// creating an user database schema
const user = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'support_agent', 'admin'],
        default: 'customer',
    }
}, {timestamps: true})

export const UserModel = mongoose.model('userModel', user)
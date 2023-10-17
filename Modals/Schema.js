import mongoose from "mongoose";

const todoschema = new mongoose.Schema({
    Heading: {
        type: String,
        required: true,
    },
    About: {
        type: String,
        required: true,
    },
    isComplated: {
        type: String,
        default: false,
    },
    Email: String
});
export const msg = mongoose.model('Todo', todoschema);
const loginschema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,

    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
export const login = mongoose.model('Login', loginschema);

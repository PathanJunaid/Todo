import mongoose from "mongoose";

const todoschema = new mongoose.Schema({
    Heading: String,
    About: String,
    Email: String
});
export const msg =  mongoose.model('Todo', todoschema);
const loginschema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String
})
export const login = mongoose.model('Login', loginschema);

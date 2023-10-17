import Express from "express";
import { UserisLogin } from "../Middlewares/user_modules.js";
import { Login, Login_Post, Logout, Register, Register_Post } from "../Controllers/User_Login.js";

const User_Routes = Express.Router();

// Get Login page url 
User_Routes.get('/login', UserisLogin, Login);


// get register page url 
User_Routes.get('/register', UserisLogin, Register);

//get Logout url 
User_Routes.get('/logout', Logout);

// Post request url 
User_Routes.post('/register', Register_Post)

// Post Login url 
User_Routes.post('/login', Login_Post);

export default User_Routes;
import { login } from "../Modals/Schema.js";
import bcrypt from 'bcrypt';
import  Jwt  from "jsonwebtoken";

// Get Login page  
export const Login = (req, res) => {
    // Sending response To user 
    const msg = req.query.msg;
    // Rendering LOgin page 
    res.render('login.ejs', { msg });
}
// Get Register page 
export const Register = (req, res) => {
    // rendering Register page 
    res.render('register.ejs');
};
// Get Logout Function
export const Logout = async (req, res) => {
    // Requesting Browser to get Cookies 
    const { token } = req.cookies;
    // Removing Cookies so that User can Logout 
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite:'Lax'
    })
    // Redirecting user to Login page 
    res.redirect('/');
};

// User is registered in database
export const Register_Post = async (req, res) => {
    // Getting Value Given in form 
    const { name, email, password } = req.body;
    // Checking if User already Exist 
    let user = await login.findOne({ Email: email });
    if (user) {
        return res.render('register', { newMsg: "Email Already in Use" });
    }
    // Converting pssword to hash 
    const HashedPassword = await bcrypt.hash(password, 10);
    // Registering user to Databse 
    login.create({
        Name: name,
        Email: email,
        Password: HashedPassword
    })
    // redirecting Login page 
    res.redirect("/login");
}

// Fucntion To Login user 
export const Login_Post = async (req, res) => {
    // Getting Value Given in form 
    const { email, password } = req.body;
     // Checking if User already Exist 
    let user = await login.findOne({ Email: email });
    if (!user) {
        return res.redirect(`/login?msg=User Not Registered Please Register.`);
    }
    // Campareing hash password 
    const pass = await bcrypt.compare(password, user.Password);
    if (!pass) {
        return res.render('login', { error: "Wrong Password" });
    }
    // generating a JWt Token for id 
    const token = Jwt.sign({ _id: user._id }, process.env.SecretToken);
    // Setting Cookie in browser for authentication that uaer is login or not 
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        secure: true,
        sameSite:'Lax'
    })
    // redirecting to user Todo page 
    res.redirect('/');
}

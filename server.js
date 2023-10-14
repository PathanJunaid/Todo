// const express = require('express')
import express from 'express';
import mongoose from 'mongoose';
import ejs from "ejs";
import cookieParser from 'cookie-parser';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { Console, error } from 'console';
const app = express()
const port = 3004;

// middlewares starts
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.set("view engine", 'ejs');

// middleware ends
// Pages 
// Coonenting database named Tododata
mongoose.connect('mongodb+srv://JunaidKhan:fardeen786@tododata.4opmabr.mongodb.net/', {
  dbName: "TodoData",
}).then(c => {
  console.log("Connection Made")
}).catch(e => {
  console.log("Connection failed")
})

// Schema of todo list 
const todoschema = new mongoose.Schema({
  Heading: String,
  About: String,
  Email:String
})

// Scehma Login Details 
const loginschema = new mongoose.Schema({
  Name: String,
  Email: String,
  Password: String
})
// Connection to collection in databse
const msg = mongoose.model('Todo', todoschema)
// Login Collection 
const login = mongoose.model('Login', loginschema)

// Authenticaton Function 
const authentication = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    next();
  }
  else {
    res.redirect('/login');
  }

}

// Get request url 

app.get('/', authentication, (req, res) => {
  res.render('Home');
})

// Login page url 
app.get('/login', (req, res) => {
  const msg = req.query.msg;
  res.render('login.ejs',{msg});
})
// register page url 
app.get('/register', (req, res) => {
  res.render('register.ejs');
})
// Tododata showing url
app.get('/todos',authentication, async (req, res) => {
   // saving Todo using user Email 
   const {token} = req.cookies;
   const {_id} = await Jwt.verify(token,"secrettoken")
   const user_detail= await login.findById({_id})
  const data = await msg.find({Email:user_detail.Email});
  res.render('todos.ejs', { data: data });
})
// Update page url 
app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const entry = await msg.findById(id);
    if (!entry) {
      return res.status(404).send('Entry not found');
    }
    res.render('update.ejs', { entry: entry });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// Deleting Todo DATA 
app.get('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await msg.findByIdAndDelete(id);
  res.redirect('/todos')
})

// Logout url 
app.get('/logout', async (req, res) => {
  const { token } = req.cookies;
  await res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true
  })
  res.redirect('/');
})
// Post request url 
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  let user = await login.findOne({ Email: email });
  if(user){
    return res.render('register',{newMsg:"Email Already in Use"});
  }

  const HashedPassword =await bcrypt.hash(password, 10);
  login.create({
    Name:name,
    Email:email,
    Password:HashedPassword
  })
  res.redirect("/login");
})
// Login url 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let user = await login.findOne({ Email: email });
  if (!user) {
    return res.redirect(`/login?msg=User Not Registered Please Register.`);
  }
  const pass = await bcrypt.compare(password, user.Password);
  if(!pass){
    return res.render('login',{error: "Wrong Password"});
  }
  const token = await Jwt.sign({ _id: user._id }, "secrettoken");
  await res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
    secure: true
  })
  res.redirect('/');
})
// Adding Todo Data to database 
app.post('/', async (req, res) => {
  // saving Todo using user Email 
  const {token} = req.cookies;
  const {_id} = await Jwt.verify(token,"secrettoken")
  const user_detail= await login.findById({_id})

  // Adding data to Database 
  await msg.create({
    Heading: req.body.Topic,
    About: req.body.about,
    Email: user_detail.Email
  })
  res.redirect('/');
})

app.post('/edit/:id', async (req, res) => {
  const { Topic, about } = req.body;
  const id = req.params.id;
  try {
    await msg.findByIdAndUpdate(id, { Heading: Topic, About: about });
    res.redirect('/todos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
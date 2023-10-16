// const express = require('express')
import express from 'express';
import ejs from "ejs";
import cookieParser from 'cookie-parser';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { isdatabase_connected } from './Database/Connection.js';
import { msg, login } from './Modals/Schema.js';
import { authentication,UserisLogin } from './Function/user_modules.js';
import  {config}  from 'dotenv';
const app = express()
const port = 3004;
config();
// middlewares starts
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.set("view engine", 'ejs');

// middleware ends
// Coonenting database named Tododata
await isdatabase_connected();


// Get request url 

app.get('/', authentication, (req, res) => {
  res.render('Home');
})

// Login page url 
app.get('/login',UserisLogin, (req, res) => {
  const msg = req.query.msg;
  res.render('login.ejs', { msg });
})


// register page url 
app.get('/register',UserisLogin, (req, res) => {
  res.render('register.ejs');
})
// Tododata showing url
app.get('/todos', authentication, async (req, res) => {
  // saving Todo using user Email 
  const { token } = req.cookies;
  const { _id } = await Jwt.verify(token, process.env.SecretToken)
  const user_detail = await login.findById({ _id })
  const data = await msg.find({ Email: user_detail.Email });
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
  if (user) {
    return res.render('register', { newMsg: "Email Already in Use" });
  }

  const HashedPassword = await bcrypt.hash(password, 10);
  login.create({
    Name: name,
    Email: email,
    Password: HashedPassword
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
  if (!pass) {
    return res.render('login', { error: "Wrong Password" });
  }
  const token = await Jwt.sign({ _id: user._id }, process.env.SecretToken);
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
  const { token } = req.cookies;
  const { _id } = await Jwt.verify(token, process.env.SecretToken)
  const user_detail = await login.findById({ _id })

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
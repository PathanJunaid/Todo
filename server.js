// const express = require('express')
import express from 'express';
import ejs from "ejs";
import cookieParser from 'cookie-parser';
import { isdatabase_connected } from './Database/Connection.js';
import  {config}  from 'dotenv';
import User_Routes from './Routes/user.js';
import Todos_Routes from './Routes/Todos.js';
import cors from 'cors'
const app = express()
config();
// middlewares starts
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.set("view engine", 'ejs');
app.use(User_Routes);
app.use(Todos_Routes);
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET",'POST'],
  credentials:true,
}));
// middleware ends
// Coonenting database named Tododata
isdatabase_connected();

app.listen(process.env.port, () => {
  console.log(`Example app listening on port ${process.env.port}`)
})
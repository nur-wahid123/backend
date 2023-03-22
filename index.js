// import express from 'express'
const express = require('express');
// import cookieParser from 'cookie-parser';
const cookieParser = require('cookie-parser')
// import db from './config/Database.js'
// import dotenv from 'dotenv'
const dotenv = require('dotenv');
// import cors from 'cors'
const cors = require('cors');
// import router from './routes/UserRoutes.js';
const router = require('./routes/UserRoutes.js')

const db = require('./config/Database.js')

dotenv.config()
const app = express()

try{
    db.authenticate();
    console.log('Database connected....')
    // await users.sync();
}catch(error){
    console.error(error)
}
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(router)
//  app.listen(5000, ()=> console.log("server running port 5000"))
app.listen(8080, ()=> console.log("server running port 8080"))
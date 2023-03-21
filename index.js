import express from 'express'
import cookieParser from 'cookie-parser';
import db from './config/Database.js'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/UserRoutes.js';

dotenv.config()
const app = express()

try{
    await db.authenticate();
    console.log('Database connected....')
    // await users.sync();
}catch(error){
    console.error(error)
}
app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(cookieParser())
app.use(express.json())
app.use(router)
 app.listen(5000, ()=> console.log("server running port 5000"))
//app.listen(8080, ()=> console.log("server running port 8080"))
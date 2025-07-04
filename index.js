import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();
import Auth from './route/AuthRoute.js'
const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/auth',Auth);


const PORT = process.env.PORT ; 
const URI = process.env.MONGO_URI;
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})
mongoose.connect(URI).then(()=>{
    console.log("Database connected");
}).catch(()=>{
    console.log("Something went wrong while connceting to database")
})
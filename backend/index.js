import express from "express"; 
import mongoose from "mongoose"; 
import dotenv from 'dotenv'; 
import cors from 'cors'
import  ticketRouter from './routes/ticketRoutes.js'
import userRouter from './routes/userRoute.js'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(cors())
app.use(
    cors({
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
)
mongoose.connect(process.env.MONGO)
    .then(() => {
        // Start the server
        app.listen(process.env.PORT, () => {
            console.log('App is listening on port', process.env.PORT);
            console.log('Successful connection to the database');
        });
    })
    .catch(error => {
        console.log('Error connecting to the database', error);
    });

app.use('/api/ticket', ticketRouter)
app.use('/api/user', userRouter)
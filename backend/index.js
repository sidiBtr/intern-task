import express from "express"; 
import mongoose from "mongoose"; 
import dotenv from 'dotenv'; 
import cors from 'cors';
import path from 'path'; // Provides utilities for working with file and directory paths
import { fileURLToPath } from 'url'; // Converts a file URL to a file path
import ticketRouter from './routes/ticketRoutes.js';
import userRouter from './routes/userRoute.js';
import { swaggerUi, swaggerDocs } from '../config/swagger.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Serve static files

// CORS setup
app.use(cors({
    origin:  "*",// "https://intern-task-5z54.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

// MongoDB connection
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Successful connection to the database');
        // Start the server
        app.listen(process.env.PORT, () => {
            console.log('App is listening on port', process.env.PORT);
        });
    })
    .catch(error => {
        console.error('Error connecting to the database', error);
    });

// API routes
app.use('/api/ticket', ticketRouter);
app.use('/api/user', userRouter);

// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

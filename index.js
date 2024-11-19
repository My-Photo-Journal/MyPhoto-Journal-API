import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import photoRouter from './routes/photos.js';
import eventRouter from './routes/events.js';
import userRouter from './routes/users.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected."))
    .catch((error) => console.log("Error connecting to the database", error));

const app = express();


// Security middleware should come first
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Rate limiters
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20 // limit each IP to 20 login attempts per hour
});

// Apply rate limiters
app.use(limiter);
app.use('/users/login', authLimiter);
app.use('/users/register', authLimiter);

// Routes
app.use(photoRouter);
app.use(eventRouter);
app.use(userRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    // Handle Joi validation errors
    if (err.isJoi) {
        return res.status(422).json({
            status: 'error',
            message: 'Validation error',
            details: err.details
        });
    }

    // Handle Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            status: 'error',
            message: 'File too large, maximum size is 5MB'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            status: 'error',
            message: 'Too many files, maximum is 10 files'
        });
    }

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            status: 'error',
            message: 'Duplicate entry found'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// Add after your routes
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// Function to find an available port
const startServer = async (initialPort) => {
    let port = initialPort;
    
    while (true) {
        try {
            await new Promise((resolve, reject) => {
                const server = app.listen(port)
                    .once('listening', () => {
                        console.log(`App is listening on port ${port}`);
                        resolve();
                    })
                    .once('error', (err) => {
                        if (err.code === 'EADDRINUSE') {
                            port++;
                            server.close();
                            resolve();
                        } else {
                            reject(err);
                        }
                    });
            });
            break;
        } catch (error) {
            console.error(`Failed to start server:`, error);
            process.exit(1);
        }
    }
};

// Start the server with initial port from env or 3000
startServer(process.env.PORT || 3000);


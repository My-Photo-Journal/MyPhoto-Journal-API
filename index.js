import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import photoRouter from './routes/photos.js';
import userRouter from './routes/users.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected."))
    .catch((error) => console.log("Error connecting to the database", error));

const app = express();


// Security middleware should come first
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiters
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5 // limit each IP to 5 login attempts per hour
});

// Apply rate limiters
app.use(limiter);
app.use('/users/login', authLimiter);
app.use('/users/register', authLimiter);

// Routes
app.use(photoRouter);
app.use(userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
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


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import photoRouter from './routes/photos.js';
import userRouter from './routes/users.js';


await mongoose.connect(process.env.MONGO_URI)

const app = express();

app.use(express.json());
app.use(cors());
app.use(photoRouter);
app.use(userRouter);


app.listen(8080, () => {
    console.log('App is listening on port 8080');
});


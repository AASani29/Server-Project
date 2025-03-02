import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import sessionMiddleware from './Middleware/session.js';
import passportMiddleware from './Middleware/passport.js';


import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import mediaRoutes from './routes/media.route.js';
import commentRoutes from './routes/comment.route.js';


dotenv.config();


if (!process.env.MONGO) {
  console.error('Error: MONGO environment variable is not defined.');
  process.exit(1);
}

const app = express();
const __dirname = path.resolve();


mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });


app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(sessionMiddleware);
app.use(passportMiddleware);


app.use('/api/media', mediaRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

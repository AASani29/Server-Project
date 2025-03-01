import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import mediaRoutes from './routes/media.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import cors from "cors";

import commentRoutes from "./routes/comment.route.js"; 
// Load environment variables
dotenv.config();

// Ensure MONGO environment variable is set
if (!process.env.MONGO) {
  console.error('Error: MONGO environment variable is not defined.');
  process.exit(1);
}

const app = express();
const __dirname = path.resolve();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit if the database connection fails
  });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend requests
    credentials: true, // Allow cookies (for JWT auth)
  })
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : '',
        avatar: profile.photos[0].value,
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get(
  "/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "GitHub authentication failed" });
    }

    // ✅ Store user in session and send data back
    req.session.user = req.user;

    // ✅ Redirect with user details in query params
    res.redirect(`http://localhost:5173/uploadmedia?name=${req.user.name}&email=${req.user.email}&photo=${req.user.avatar}`);
  }
);


// API routes
app.use('/api/media', mediaRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/comments", commentRoutes); // ✅ Register comment routes
// Catch-all route for serving the client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`Error: ${message} (Status: ${statusCode})`);
  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
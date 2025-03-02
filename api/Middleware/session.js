import session from 'express-session';

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: true,
});

export default sessionMiddleware;

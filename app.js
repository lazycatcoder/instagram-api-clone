const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Create an instance of the Express application
const app = express();
// Set the port for the server to listen on
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to handle file uploads
app.use(fileUpload());

// Middleware to parse cookies with secure options
app.use(cookieParser({
  secure: true,
  httpOnly: true,
  sameSite: 'none'
}));

// Set headers to allow cross-domain requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// // Middleware to restrict requests
// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 min
//   max: 20, // Maximum number of requests
//   message: 'The limit on the number of requests has been exceeded. Try later.',
// });

// // Applying middleware to every request
// app.use(limiter);

// Import routes
const usersRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Successful connection to MongoDB!');
  })
  .catch((error) => {
    console.error('Error when connecting to MongoDB:', error);
  });

// Handling Static Files
app.use('/images', express.static(path.join(__dirname, 'images')));

// Application routes
app.use('/api/users', usersRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);

// Handling error 401
app.use((err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).json({
      error: {
        message: 'Access is denied. Authenticate or register.',
      },
    });
  } else {
    next(err);
  }
});

// Handling error 404
app.use((req, res, next) => {
  const error = new Error('Wrong route.');
  error.status = 404;
  next(error);
});

// Handling error 500
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error.',
    },
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
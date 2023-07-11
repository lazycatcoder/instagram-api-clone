const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');
const validSignupLogin = require('../middleware/validSignupLogin');
const router = express.Router();


// POST /api/auth/signup
router.post('/signup', validSignupLogin.signup, authController.signup);

// POST /api/auth/login
router.post('/login', validSignupLogin.login, authController.login);

// GET /api/auth/checkemail/:email
router.get('/checkemail/:email', authController.checkEmail);

// POST /api/auth/logout
router.post('/logout', authController.logout);


module.exports = router;
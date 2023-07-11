const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation error', errors: errors.array() });
  }

  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and password confirmation do not match.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    const newUser = await user.save();
    newUser.token = newUser.generateAuthToken();
    await newUser.save();
    res.status(201).json({
      message: 'User successfully registered.',
      user: newUser,
      token: newUser.token,
    });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation error', errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user && user.token) {
      return res.status(403).json({ message: `User ${user.username} already authorized.` });
    }

    user.token = user.generateAuthToken();
    await user.save();

    res.cookie('userId', user._id);
    res.cookie('token', user.token);

    res.status(200).json({ token: user.token, user });
  } catch (err) {
    next(err);
  }
};


exports.checkEmail = async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    const emailExist = !!user;
    res.status(200).json({ emailExist });
  } catch (err) {
    next(err);
  }
};


exports.logout = async (req, res, next) => {
  try {
    const userId = req.body._id;

    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User is not found.' });
    }

    // Clearing the authentication token
    user.clearAuthToken();
    await user.save();

    // Removing the token from the user object
    user.token = undefined;

    // Removing user ID and token from cookies
    res.clearCookie('userId');
    res.clearCookie('token');

    res.status(200).json({ message: `User ${user.username} logged out successfully.` });
  } catch (err) {
    next(err);
  }
};

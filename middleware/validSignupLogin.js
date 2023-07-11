const { body } = require('express-validator');
const User = require('../models/user');


module.exports.signup = [
  body('username').isLength({ min: 4 }).withMessage('Username must contain at least 4 characters.'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format.')
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject('This email address is already registered.');
        }
      });
    }),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters'),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match.");
      }
      return true;
    }),
];


module.exports.login = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format.')
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject('Invalid email address or password.');
        }
      });
    }),
  body('password')
    .trim()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      if (!user.password) {
        throw new Error('Log in with your account.');
      } else {
        const isPasswordValid = await user.comparePassword(value);
        if (!isPasswordValid) {
          throw new Error('Invalid email address or password.');
        }
      }
      return true;
    }),
];
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: null },
  },
  { timestamps: true }
);

// Generation of an authentication token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY || 'mysecretkey');
  this.token = token; // Save the token in the user field
  return token;
};

// Clearing the authentication token
userSchema.methods.clearAuthToken = function () {
  this.token = null; // Set token field to null
};

// Password comparison
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

// Overriding the toJSON method to exclude the token field
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.token;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
const jwt = require('jsonwebtoken');
const User = require('../models/user');


module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  // If there is no authorization token in the header
  if (!authHeader) {
    return res.status(401).json({ message: 'Access closed. Missing token.' });

  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  // Authorization token verification
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY || 'mysecretkey');
    // Authorized user data
    req.userId = decodedToken._id;

    // Checking if the token is valid
    const user = await User.findById(req.userId);
    if (!user || user.token !== token) {
      res.status(401).json({ message: 'Access closed. Invalid token. Authenticate or register.' });
      return;
    }

    next();
  } catch (err) {
    // If the authorization token is invalid
    res.status(401).json({ message: 'Access closed. Invalid token. Authenticate or register.' });
  }
};
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.users = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];

    // Checking for a token
    if (!token) {
      return res.status(401).json({ message: 'Access is denied. Requires authentication.' });
    }

    // Finding a user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: 'Access is denied. Invalid token.' });
    }

    // Checking if an authorized user is the owner of the user information
    if (id && id !== user._id.toString()) {
      return res.status(403).json({ message: 'Access is denied. Not enough rights.' });
    }

    req.userId = user._id.toString(); // Assigning a user ID in req for later use
    next();
  } catch (err) {
    next(err);
  }
};


module.exports.posts = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const token = req.headers.authorization.split(' ')[1];

    // Checking for a token
    if (!token) {
      return res.status(401).json({ message: 'Access is denied. Requires authentication.' });
    }

    // Finding a user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: 'Access is denied. Invalid token.' });
    }

    // Checking if an authorized user is the owner of a post
    if (postId) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }
      if (post.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Access is denied. Not enough rights.' });
      }
    }

    req.userId = user._id.toString(); // Assigning a user ID in req for later use
    next();
  } catch (err) {
    next(err);
  }
};


module.exports.comments = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const token = req.headers.authorization.split(' ')[1];

    // Checking for a token
    if (!token) {
      return res.status(401).json({ message: 'Access is denied. Requires authentication.' });
    }

    // Finding a user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: 'Access is denied. Invalid token.' });
    }

    // Checking if an authorized user is the owner of a comment
    if (commentId) {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
      }
      if (comment.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Access is denied. Not enough rights.' });
      }
    }

    req.userId = user._id.toString(); // Assigning a user ID in req for later use
    next();
  } catch (err) {
    next(err);
  }
};
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');


exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Delete all posts
    await Post.deleteMany({ userId });
    // Delete all comments
    await Comment.deleteMany({ userId });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};
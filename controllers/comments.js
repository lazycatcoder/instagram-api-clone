const Comment = require('../models/comment');
const User = require('../models/user');


exports.getAllComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find().skip(skip).limit(limit);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    const userId = user._id;

    const newComment = new Comment({ userId, postId, text });
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.getUserComments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ userId }).skip(skip).limit(limit);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.getCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { text },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

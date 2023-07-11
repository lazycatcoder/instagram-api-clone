const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
}, { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
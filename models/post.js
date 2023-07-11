const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  imageURL: { type: String, required: true },
  description: { type: String, default: '' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
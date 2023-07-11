const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');


exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const imageFile = req.files.image; // Get the uploaded file from the request

    const token = req.headers.authorization.split(' ')[1];

    // Find user in database by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    const userId = user._id;

    // Generating the path to the folder to save the file
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const userImageDir = `images/${userId}/${year}/${month}/${day}`;

    // Create folders recursively if they don't exist
    fs.mkdirSync(path.join(__dirname, '..', userImageDir), { recursive: true });

    // Generate filename based on user ID and UUID
    const imageId = uuidv4();
    const imageName = `${userId}-${imageId}.jpg`;
    const imagePath = path.join(__dirname, '..', userImageDir, imageName);

    // Save the downloaded file to the specified path
    await imageFile.mv(imagePath);

    // Update the imageURL in the database
    const imageURL = `${req.protocol}://${req.get('host')}/${userImageDir}/${imageName}`;
    const newPost = new Post({ userId, imageURL, description });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId }).skip(skip).limit(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.updatePost = async (req, res) => {
  try {
    const { imageURL, description } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { imageURL, description },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    // Delete all associated comments
    await Comment.deleteMany({ postId: req.params.postId });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};
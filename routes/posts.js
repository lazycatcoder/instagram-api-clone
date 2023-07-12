const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const isValid = require('../middleware/isValid');
const isAuth = require('../middleware/isAuth');
const accessControl = require('../middleware/accessControl');


// GET /api/posts
router.get('/', isValid, postsController.getAllPosts);

// POST /api/posts
router.post('/', isAuth, postsController.createPost);

// GET /api/posts/user/:userId
router.get('/user/:userId', isValid, postsController.getUserPosts);

// GET /api/posts/:postId
router.get('/:postId', isValid, postsController.getPostById);

// PUT /api/posts/:postId
router.put('/:postId', [isAuth, isValid, accessControl.posts], postsController.updatePost);

// DELETE /api/posts/:postId
router.delete('/:postId', [isAuth, isValid, accessControl.posts], postsController.deletePost);


module.exports = router;
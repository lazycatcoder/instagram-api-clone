const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments');
const isValid = require('../middleware/isValid');
const isAuth = require('../middleware/isAuth');
const accessControl = require('../middleware/accessControl');


// GET /api/comments
router.get('/', isValid, commentController.getAllComments);

// POST /api/comments
router.post('/', isAuth, commentController.createComment);

// GET /api/comments/user/:userId
router.get('/user/:userId', isValid, commentController.getUserComments);

// GET /api/comments/post/:postId
router.get('/post/:postId', isValid, commentController.getCommentsByPostId);

// GET /api/comments/:commentId
router.get('/:commentId', isValid, commentController.getCommentById);

// PUT /api/comments/:commentId
router.put('/:commentId', [isAuth, isValid, accessControl.comments], commentController.updateComment);

// DELETE /api/comments/:commentId
router.delete('/:commentId', [isAuth, isValid, accessControl.comments], commentController.deleteComment);


module.exports = router;
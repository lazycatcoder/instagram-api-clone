const { ObjectId } = require('mongoose').Types;


module.exports = async (req, res, next) => {
  try {
    const { userId, postId, commentId } = req.params;

    if (userId && !ObjectId.isValid(userId)) {
      const error = new Error(`Invalid user ID: ${userId}`);
      error.statusCode = 404;
      throw error;
    }

    if (postId && !ObjectId.isValid(postId)) {
      const error = new Error(`Invalid post ID: ${postId}`);
      error.statusCode = 404;
      throw error;
    }

    if (commentId && !ObjectId.isValid(commentId)) {
      const error = new Error(`Invalid comment ID: ${commentId}`);
      error.statusCode = 404;
      throw error;
    }

    next();
  } catch (err) {
    next(err);
  }
};
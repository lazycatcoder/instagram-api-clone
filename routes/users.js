const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const isValid = require('../middleware/isValid');
const isAuth = require('../middleware/isAuth');
const accessControl = require('../middleware/accessControl');


// GET /api/users
router.get('/', isValid, usersController.getUsers);

// GET /api/users/:id
router.get('/:id', isValid, usersController.getUserById);

// PUT /api/users/:id
router.put('/:id', [isAuth, isValid, accessControl.users], usersController.updateUser);

// DELETE /api/users/:id
router.delete('/:id', [isAuth, isValid, accessControl.users], usersController.deleteUser);


module.exports = router;



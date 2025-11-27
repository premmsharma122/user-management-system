
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');


router.route('/').get(protect, admin, getUsers);

// Get, Update, Delete a single user
router.route('/:id')
    .get(protect, getUserById)  // Admin or User itself
    .put(protect, updateUser) // Admin or User itself
    .delete(protect, admin, deleteUser); // Admin Only

module.exports = router;
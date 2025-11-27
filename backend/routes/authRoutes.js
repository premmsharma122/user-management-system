
const express = require('express');
const router = express.Router();

const { registerUser, loginUser, validateRegistration, refreshAccessToken } = require('../controllers/authController');
const upload = require('../utils/multerConfig');


router.post('/refresh-token', refreshAccessToken);

// POST /api/auth/register - Register user with image upload
router.post('/register', 
    upload.single('profile_image'), // Middleware for image upload 
    validateRegistration, 
    registerUser
);

// POST /api/auth/login - Login user
router.post('/login', loginUser);

module.exports = router;
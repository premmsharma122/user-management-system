// /backend/controllers/authController.js (UPDATED with refreshAccessToken)

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/tokenUtils');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); // <-- REQUIRED for token verification

// --- Input Validation Middleware for Registration ---
const validateRegistration = [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only alphabets'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('phone').isLength({ min: 10, max: 15 }).isNumeric().withMessage('Phone must be 10-15 digits'),
    body('password').isLength({ min: 6 }).matches(/\d/).withMessage('Password must be at least 6 characters and contain a number'),
    body('address').optional().isLength({ max: 150 }).withMessage('Address max 150 characters'),
    body(['state', 'city', 'country', 'pincode']).notEmpty().withMessage(field => `${field} is required`),
    body('pincode').isLength({ min: 4, max: 10 }).withMessage('Pincode must be 4-10 digits'),
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password, address, state, country, city, pincode } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email or phone number');
    }

    // profile_image URL comes from Cloudinary after upload middleware runs
    const profile_image = req.file ? req.file.path : 'default_url';

    const user = await User.create({
        name, email, phone, password, address, state, country, city, pincode, profile_image
    });

    if (user) {
        const { accessToken, refreshToken } = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image,
            role: user.role,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { loginId, password } = req.body; // loginId can be email or phone

    const user = await User.findOne({ $or: [{ email: loginId }, { phone: loginId }] });

    if (user && (await user.matchPassword(password))) {
        const { accessToken, refreshToken } = generateToken(user._id, user.role);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken, // Access Token (1 hour)
            refreshToken, // Refresh Token (7 days)
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public (Requires refresh token in body)
const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401);
        throw new Error('Refresh token is required');
    }

    try {
        // 1. Verify the refresh token using the JWT_SECRET
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET); 
        
        // 2. Find the user associated with the token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401);
            throw new Error('Invalid user linked to token');
        }

        // 3. Generate NEW access and refresh tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateToken(user._id, user.role);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken, // Refresh token rotation
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        // Handles expired/malformed JWT
        res.status(403);
        throw new Error('Refresh token expired or invalid');
    }
});


module.exports = { registerUser, loginUser, validateRegistration, refreshAccessToken };
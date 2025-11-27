// userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// --- Input Validation Middleware for Update ---
const validateUpdate = [
    body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only alphabets'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('phone').optional().isLength({ min: 10, max: 15 }).isNumeric().withMessage('Phone must be 10-15 digits'),
    body('address').optional().isLength({ max: 150 }).withMessage('Address max 150 characters'),
    body(['state', 'city', 'country', 'pincode']).optional().notEmpty().withMessage(field => `${field} is required`),
    body('pincode').optional().isLength({ min: 4, max: 10 }).withMessage('Pincode must be 4-10 digits'),
];

// @desc    List all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // Admin dashboard features: Search & Filter
    const keyword = req.query.keyword ? {
        $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
            { state: { $regex: req.query.keyword, $options: 'i' } },
            { city: { $regex: req.query.keyword, $options: 'i' } },
        ],
    } : {};

    const users = await User.find({ ...keyword }).select('-password');
    res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin or User itself
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        // User can view their own profile, or Admin can view any profile
        if (req.user._id.toString() === user._id.toString() || req.user.role === 'admin') {
            res.json(user);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this user');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private/Admin or User itself
const updateUser = [
    ...validateUpdate,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findById(req.params.id);

        if (user) {
            // User can update their own profile, or Admin can update any profile
            if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
                res.status(403);
                throw new Error('Not authorized to update this user');
            }

            // Only update fields that are present in the request body
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.state = req.body.state || user.state;
            user.country = req.body.country || user.country;
            user.city = req.body.city || user.city;
            user.pincode = req.body.pincode || user.pincode;
            
            // Image update logic (requires separate PUT route with upload middleware for robustness)
            // For simplicity here, we assume image update is handled in a separate dedicated endpoint
            
            // Only Admin can change the role
            if (req.user.role === 'admin' && req.body.role) {
                user.role = req.body.role;
            }

            const updatedUser = await user.save();
            
            // Security Requirement: No sensitive data in API responses
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                // ... other non-sensitive fields
            });

        } else {
            res.status(404);
            throw new Error('User not found');
        }
    })
];

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
            // Optional: Prevent Admin from deleting another Admin if needed
        }

        await User.deleteOne({ _id: user._id }); // Use deleteOne to avoid deprecation warnings
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { getUsers, getUserById, updateUser, deleteUser };
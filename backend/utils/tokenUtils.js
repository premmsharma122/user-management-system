
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    // Generate Access Token (1 hour)
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES, // 1h
    });

    // Generate Refresh Token (7 days)
    const refreshToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES, // 7d
    });

    return { accessToken, refreshToken };
};

module.exports = generateToken;
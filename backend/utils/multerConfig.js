
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-profiles', // Cloudinary folder
        format: async (req, file) => 'png', // supports jpg/png
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

// Configure Multer for image upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true); // Accept
        } else {
            cb(new Error('Only JPEG and PNG images are allowed'), false); // Reject
        }
    }
});

module.exports = upload;
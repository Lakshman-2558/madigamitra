import express from 'express';
import multer from 'multer';
import bcryptjs from 'bcryptjs';
import { verifyToken, generateToken } from '../middleware/auth.js';
import {
  uploadProfile,
  uploadBulkProfiles,
  getAllProfiles,
  deleteProfile
} from '../controllers/profileController.js';
import Admin from '../models/Admin.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `temp_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedMimes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

/**
 * ADMIN LOGIN
 * POST /api/admin/login
 * Body: { username, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required'
      });
    }

    // For demo: simple validation
    // In production, fetch from database and verify hashed password
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken('admin_1', username);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        username
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (error) {
    console.error('Login Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

/**
 * ADMIN: Upload profile
 * POST /api/admin/upload
 * Requires: JWT token, image file, category
 */
router.post('/upload', verifyToken, upload.single('image'), uploadProfile);

/**
 * ADMIN: Bulk Upload profiles
 * POST /api/admin/bulk-upload
 * Requires: JWT token, image files array, category
 */
router.post('/bulk-upload', verifyToken, upload.array('images', 200), uploadBulkProfiles);

/**
 * ADMIN: Get all profiles
 * GET /api/admin/profiles
 * Requires: JWT token
 */
router.get('/profiles', verifyToken, getAllProfiles);

/**
 * ADMIN: Delete profile
 * DELETE /api/admin/profiles/:profileId
 * Requires: JWT token
 */
router.delete('/profiles/:profileId', verifyToken, deleteProfile);

export default router;

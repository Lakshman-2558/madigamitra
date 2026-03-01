import express from 'express';
import { searchProfiles, getPublicProfiles } from '../controllers/profileController.js';

const router = express.Router();

/**
 * USER: Search profiles
 * GET /api/search
 * Query: ?q=91 (year) or ?q=90791 (full code)
 */
router.get('/search', searchProfiles);

/**
 * USER: Get public profiles
 * GET /api/profiles
 */
router.get('/profiles', getPublicProfiles);

export default router;

import Profile from '../models/Profile.js';
import { extractCodeFromImage, parseProfileCode } from '../utils/ocrService.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryConfig.js';
import { validateImage, resizeImage, cleanupFile, generateFilename } from '../utils/imageProcessor.js';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fsSync.existsSync(uploadsDir)) {
  fsSync.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * ADMIN: Upload profile with OCR
 * POST /api/admin/upload
 */
export const uploadProfile = async (req, res) => {
  let tempFilePath = null;
  let processedFilePath = null;

  try {
    // Validate image file
    validateImage(req.file);

    const filename = generateFilename();
    tempFilePath = req.file.path;
    processedFilePath = path.join(uploadsDir, filename);

    // Resize and compress image
    await resizeImage(tempFilePath, processedFilePath);

    // Run OCR to extract code
    const profileCode = await extractCodeFromImage(processedFilePath);

    if (!profileCode) {
      throw new Error('Code not detected. Please upload clear image.');
    }

    const { sequenceNumber, month, year } = parseProfileCode(profileCode);

    // Check if profile code already exists (must be unique)
    const existingProfile = await Profile.findOne({ profileCode });
    if (existingProfile) {
      throw new Error(`Duplicate! Profile code ${profileCode} already exists.`);
    }

    const { category } = req.body;

    if (!category || !['Bride', 'Groom'].includes(category)) {
      throw new Error('Invalid category. Must be Bride or Groom');
    }

    // Upload to Cloudinary
    const { url: imageUrl, publicId } = await uploadToCloudinary(processedFilePath);

    // Save to MongoDB
    const newProfile = new Profile({
      profileCode,
      sequenceNumber,
      month,
      year,
      category,
      imageUrl,
      publicId,
      status: 'active'
    });

    await newProfile.save();

    // Cleanup local files
    await cleanupFile(tempFilePath);
    await cleanupFile(processedFilePath);

    return res.status(201).json({
      success: true,
      message: 'Profile uploaded successfully',
      profile: newProfile
    });
  } catch (error) {
    // Cleanup on error
    if (tempFilePath) await cleanupFile(tempFilePath);
    if (processedFilePath) await cleanupFile(processedFilePath);

    console.error('Upload Error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload profile'
    });
  }
};

/**
 * ADMIN: Upload multiple profiles with OCR
 * POST /api/admin/bulk-upload
 */
export const uploadBulkProfiles = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || !['Bride', 'Groom'].includes(category)) {
      throw new Error('Invalid category. Must be Bride or Groom');
    }

    if (!req.files || req.files.length === 0) {
      throw new Error('No files provided');
    }

    const results = {
      successful: 0,
      failed: 0,
      successes: [],
      errors: []
    };

    // Sequential processing to avoid memory/rate limit issues
    for (const file of req.files) {
      let tempFilePath = null;
      let processedFilePath = null;
      let profileCode = null;

      try {
        validateImage(file);

        const filename = generateFilename();
        tempFilePath = file.path;
        processedFilePath = path.join(uploadsDir, filename);

        await resizeImage(tempFilePath, processedFilePath);
        profileCode = await extractCodeFromImage(processedFilePath);

        if (!profileCode) {
          throw new Error('Code not detected');
        }

        const { sequenceNumber, month, year } = parseProfileCode(profileCode);

        const existingProfile = await Profile.findOne({ profileCode });
        if (existingProfile) {
          throw new Error(`Duplicate! Profile code ${profileCode} already exists.`);
        }

        const { url: imageUrl, publicId } = await uploadToCloudinary(processedFilePath);

        const newProfile = new Profile({
          profileCode,
          sequenceNumber,
          month,
          year,
          category,
          imageUrl,
          publicId,
          status: 'active'
        });

        await newProfile.save();

        results.successful++;
        results.successes.push({
          filename: file.originalname,
          profileCode
        });
      } catch (err) {
        results.failed++;
        results.errors.push({
          filename: file.originalname,
          profileCode,
          message: err.message || 'Failed processing'
        });
      } finally {
        if (tempFilePath) await cleanupFile(tempFilePath).catch(() => { });
        if (processedFilePath) await cleanupFile(processedFilePath).catch(() => { });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${req.files.length} files. Success: ${results.successful}, Failed: ${results.failed}`,
      results
    });
  } catch (error) {
    console.error('Bulk Upload Error:', error);

    // Clean up any remaining files if main block fails
    if (req.files) {
      for (const file of req.files) {
        await cleanupFile(file.path).catch(() => { });
      }
    }

    return res.status(400).json({
      success: false,
      message: error.message || 'Bulk upload failed'
    });
  }
};

/**
 * ADMIN: Get all profiles (with filters)
 * GET /api/admin/profiles
 * Query: ?status=active&category=Bride
 */
export const getAllProfiles = async (req, res) => {
  try {
    const { status, category } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    const profiles = await Profile.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Get Profiles Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles'
    });
  }
};

/**
 * USER: Get all active profiles (for browsing by category)
 * GET /api/profiles
 * Query: ?category=Bride or Groom
 */
export const getPublicProfiles = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = { status: 'active' };

    if (category) {
      filter.category = category;
    }

    const profiles = await Profile.find(filter).sort({ createdAt: -1 });

    const brides = profiles.filter(p => p.category === 'Bride');
    const grooms = profiles.filter(p => p.category === 'Groom');

    return res.status(200).json({
      success: true,
      count: profiles.length,
      brides: {
        count: brides.length,
        profiles: brides
      },
      grooms: {
        count: grooms.length,
        profiles: grooms
      }
    });

  } catch (error) {
    console.error('Get Public Profiles Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch public profiles'
    });
  }
};

/**
 * ADMIN: Delete profile (soft delete)
 * DELETE /api/admin/profiles/:profileId
 *
 * - Mark status as inactive
 * - Delete from Cloudinary
 */
export const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Delete from Cloudinary
    if (profile.publicId) {
      try {
        await deleteFromCloudinary(profile.publicId);
      } catch (err) {
        console.error(`Warning: Failed to delete Cloudinary asset ${profile.publicId}`);
      }
    }

    // Hard delete in database
    await Profile.findByIdAndDelete(profileId);

    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete Profile Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete profile'
    });
  }
};

/**
 * USER: Search profiles by year or full code
 * GET /api/search
 * Query: ?q=91 (year) or ?q=90791 (full code)
 *
 * Returns only active profiles
 * Sorted: Brides first, then Grooms
 */
export const searchProfiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query required'
      });
    }

    const query = q.trim();
    let filter = { status: 'active' };
    let searchType = null;

    if (query.length === 2 || query.length === 4) {
      // Year search
      let year = parseInt(query, 10);

      // Handle 4-digit year conversion (e.g., 1998 -> 98, 2000 -> 0)
      if (query.length === 4) {
        year = year % 100;
      }

      if (isNaN(year) || year < 0 || year > 99) {
        return res.status(400).json({
          success: false,
          message: 'Invalid year. Enter 2 or 4 digits (e.g., 98 or 1998)'
        });
      }

      filter.year = year;
      searchType = 'year';
    } else {
      // Full code search
      if (!/^\d+$/.test(query)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid code. Enter numbers only'
        });
      }

      filter.profileCode = query;
      searchType = 'code';
    }

    // Find profiles
    const profiles = await Profile.find(filter)
      .sort({ category: 1 }); // Bride (B) comes before Groom (G) alphabetically

    // Separate by category for better organization
    const brides = profiles.filter(p => p.category === 'Bride');
    const grooms = profiles.filter(p => p.category === 'Groom');

    return res.status(200).json({
      success: true,
      searchType,
      query,
      total: profiles.length,
      brides: {
        count: brides.length,
        profiles: brides
      },
      grooms: {
        count: grooms.length,
        profiles: grooms
      }
    });
  } catch (error) {
    console.error('Search Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
};

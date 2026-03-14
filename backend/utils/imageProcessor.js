import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Validate image file
 *
 * @param {object} file - Multer file object
 * @throws {Error} - If validation fails
 */
export const validateImage = (file) => {
  if (!file) {
    throw new Error('No file uploaded');
  }
};

/**
 * Resize and compress image
 *
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to save processed image
 * @returns {Promise<void>}
 */
export const resizeImage = async (inputPath, outputPath) => {
  try {
    await fs.access(inputPath);
    await sharp(inputPath)
      .resize(1200, 1600, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  } catch (error) {
    console.error('Image Resize Error:', error);
    throw new Error(`Failed to process image: ${path.basename(inputPath)}`);
  }
};

/**
 * Clean up temporary files
 *
 * @param {string} filePath - Path to file to delete
 */
export const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.warn('Cleanup warning:', error.message);
    }
  }
};

/**
 * Generate unique filename
 *
 * @returns {string} - Filename with timestamp
 */
export const generateFilename = () => {
  const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
  return `matrimony_${unique}.jpg`;
};

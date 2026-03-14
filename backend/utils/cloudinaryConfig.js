import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Ensure variables are loaded before configuring

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000 // 120 seconds timeout for large uploads
});

/**
 * Upload image to Cloudinary with retry logic
 *
 * @param {string} filePath - Local file path
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<object>} - { url, publicId }
 */
export const uploadToCloudinary = async (filePath, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'matrimony-profiles',
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        timeout: 120000 // 120 seconds per upload attempt
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error(`Cloudinary Upload Error (attempt ${attempt}/${retries}):`, error.message || error);

      // If it's a timeout error and we have retries left, wait and retry
      if (attempt < retries && (error.http_code === 499 || error.name === 'TimeoutError' || error.message?.includes('timeout'))) {
        const delay = attempt * 2000; // 2s, 4s, 6s backoff
        console.log(`Retrying upload in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Last attempt failed or non-timeout error
      throw new Error(`Failed to upload image to Cloudinary: ${error.message || 'Unknown error'}`);
    }
  }
};

/**
 * Delete image from Cloudinary
 *
 * @param {string} publicId - Cloudinary public ID
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export default cloudinary;

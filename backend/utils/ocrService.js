import Tesseract from 'tesseract.js';

/**
 * Extract 5-digit code from image using OCR
 * Format expected: XXYYZZ (e.g., 90791)
 *
 * @param {string} imagePath - Path to image file
 * @returns {Promise<string>} - 5-digit code or null if not found
 */
export const extractCodeFromImage = async (imagePath) => {
  try {
    // Run OCR on image
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => {
        // Optional: Log progress
        // console.log('OCR Progress:', m.progress);
      }
    });

    const text = result.data.text;

    // Regex to find at least 5 consecutive digits (since smallest is 1 person, 2 digit month, 2 digit year = 5 digits minimum, or more if 10+ people)
    const codeMatch = text.match(/\d{5,}/);

    if (codeMatch) {
      return codeMatch[0];
    }

    return null;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('OCR Processing Failed');
  }
};

/**
 * Parse code into components
 * format: [sequenceNumber][month][year]
 * e.g., 90791 -> year=91, month=07, sequence=9
 *       120791 -> year=91, month=07, sequence=12
 *
 * @param {string} code - numeric code string
 * @returns {object} - Parsed components
 */
export const parseProfileCode = (code) => {
  if (code.length < 5) {
    throw new Error('Code is too short');
  }

  const length = code.length;
  const yearStr = code.substring(length - 2);
  const monthStr = code.substring(length - 4, length - 2);
  const sequenceStr = code.substring(0, length - 4);

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const sequenceNumber = parseInt(sequenceStr, 10);

  // Validate
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month (${month}) in profile code: ${code}`);
  }

  return {
    sequenceNumber,
    month,
    year
  };
};

import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// Initialize Gemini API client
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Extract 5-digit code from image using Gemini 2.5 Flash
 * @param {string} imagePath - Path to image file
 * @returns {Promise<string|null>} - 5-digit code or null if not found
 */
const extractCodeWithGemini = async (imagePath) => {
  if (!genAI) {
    console.log('Gemini API key not configured, skipping Gemini fallback');
    return null;
  }

  try {
    // Read image and convert to base64
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    // Get the Gemini 2.5 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-01-01' });

    const prompt = `Extract the profile code from this image. The code is displayed at the top of the image in red text, labeled as "CODE : XXXXXXX".

The code format is: [sequenceNumber][month][year] where:
- month is 2 digits (01-12)
- year is 2 digits (e.g., 91, 92, 93, 00, 01, etc.)
- sequenceNumber is 1 or more digits

Examples of valid codes:
- 90791 means sequence=9, month=07, year=91
- 120791 means sequence=12, month=07, year=91  
- 0210300 means sequence=021, month=03, year=00

Look for text that says "CODE :" followed by numbers. Return ONLY the numeric code as a string. If no code is found, return "null".`;

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }]
    });

    const response = result.response;
    const text = response.text().trim();

    // Extract just the numeric code from the response
    const codeMatch = text.match(/(\d{5,})/);
    if (codeMatch) {
      console.log(`Gemini extracted code: ${codeMatch[1]}`);
      return codeMatch[1];
    }

    if (text.toLowerCase() === 'null') {
      return null;
    }

    // Try to find any digits in the response
    const anyDigits = text.match(/\d+/);
    if (anyDigits) {
      return anyDigits[0];
    }

    return null;
  } catch (error) {
    console.error('Gemini OCR Error:', error.message);
    return null;
  }
};

/**
 * Validate if a code is properly formatted
 * @param {string} code - The code to validate
 * @returns {boolean} - True if valid
 */
const isValidCode = (code) => {
  if (!code || code.length < 5) return false;

  // Check if all digits
  if (!/^\d+$/.test(code)) return false;

  // Parse and validate month
  const length = code.length;
  const monthStr = code.substring(length - 4, length - 2);
  const month = parseInt(monthStr, 10);

  return month >= 1 && month <= 12;
};

/**
 * Extract 5-digit code from image using OCR
 * Format expected: XXYYZZ (e.g., 90791)
 *
 * @param {string} imagePath - Path to image file
 * @returns {Promise<string>} - 5-digit code or null if not found
 */
export const extractCodeFromImage = async (imagePath) => {
  try {
    // First attempt: Use Tesseract OCR (fast, local)
    console.log('Attempting Tesseract OCR...');
    const tesseractResult = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => {
        // Optional: Log progress
        // console.log('OCR Progress:', m.progress);
      }
    });

    const text = tesseractResult.data.text;
    console.log('Raw OCR text:', text.substring(0, 200)); // Log first 200 chars

    // Look for "CODE" pattern first (common in these images)
    const codePattern = text.match(/CODE\s*:?\s*(\d[\d\s]+)/i);
    if (codePattern) {
      console.log('Found CODE pattern:', codePattern[1]);
    }

    // Regex to find digits with possible spaces (like "021 0300")
    const codeWithSpacesMatch = text.match(/\d{2,}\s+\d{4,}/);
    if (codeWithSpacesMatch) {
      console.log('Found spaced code:', codeWithSpacesMatch[0]);
    }

    // Regex to find at least 5 consecutive digits anywhere
    const codeMatch = text.match(/\d{5,}/);

    // Clean up: remove spaces from spaced code
    let tesseractCode = null;
    if (codePattern) {
      tesseractCode = codePattern[1].replace(/\s+/g, ''); // Remove all spaces
    } else if (codeWithSpacesMatch) {
      tesseractCode = codeWithSpacesMatch[0].replace(/\s+/g, ''); // Remove all spaces
    } else if (codeMatch) {
      tesseractCode = codeMatch[0];
    }

    // Validate Tesseract result
    if (tesseractCode && isValidCode(tesseractCode)) {
      console.log(`Tesseract extracted valid code: ${tesseractCode}`);
      return tesseractCode;
    }

    if (tesseractCode) {
      console.log(`Tesseract found code but invalid format: ${tesseractCode}`);
    } else {
      console.log('Tesseract found no code, trying Gemini...');
    }

    // Second attempt: Use Gemini 2.5 Flash (more accurate, API-based)
    if (genAI) {
      console.log('Attempting Gemini 2.5 Flash OCR fallback...');
      const geminiCode = await extractCodeWithGemini(imagePath);

      if (geminiCode && isValidCode(geminiCode)) {
        console.log(`Gemini extracted valid code: ${geminiCode}`);
        return geminiCode;
      }

      if (geminiCode) {
        console.log(`Gemini found code but invalid format: ${geminiCode}`);
      }
    }

    // If we got here, neither OCR method found a valid code
    // Return Tesseract's result if it found something, even if invalid
    // Or return null if both failed
    return tesseractCode || null;

  } catch (error) {
    console.error('OCR Error:', error);

    // If Tesseract completely failed, try Gemini as last resort
    if (genAI) {
      console.log('Tesseract failed, trying Gemini as last resort...');
      try {
        const geminiCode = await extractCodeWithGemini(imagePath);
        if (geminiCode && isValidCode(geminiCode)) {
          return geminiCode;
        }
      } catch (geminiError) {
        console.error('Gemini fallback also failed:', geminiError.message);
      }
    }

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

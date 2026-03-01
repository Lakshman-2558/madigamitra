import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    // OCR extracted code: 90791 or 1201093
    profileCode: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{5,}$/,
      trim: true
    },

    // First sequence part (can be 1, 2, or more digits)
    sequenceNumber: {
      type: Number,
      required: true,
      min: 0
    },

    // Next 2 digits: 07
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },

    // Last 2 digits: 91
    year: {
      type: Number,
      required: true,
      min: 0,
      max: 99
    },

    // Bride or Groom
    category: {
      type: String,
      required: true,
      enum: ['Bride', 'Groom']
    },

    // Cloudinary URL
    imageUrl: {
      type: String,
      required: true
    },

    // Cloudinary public ID for deletion
    publicId: {
      type: String,
      required: true
    },

    // Active or Deleted
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// Index for faster searches
profileSchema.index({ year: 1, category: 1 });
profileSchema.index({ profileCode: 1, status: 1 });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;

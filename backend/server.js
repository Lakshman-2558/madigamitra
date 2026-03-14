import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables IMMEDIATELY to avoid undefined env vars in downstream modules like Cloudinary
dotenv.config();

// Import routes
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const normalizeOrigin = (o) => (o ? o.replace(/\/$/, '') : o);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', // Backup Vite port
  ...envOrigins
].map(normalizeOrigin);

app.use(cors({
  origin: function (origin, callback) {
    const normalized = normalizeOrigin(origin);
    if (!origin || allowedOrigins.includes(normalized)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.options('*', cors());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

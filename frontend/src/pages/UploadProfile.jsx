import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadBulkProfiles } from '../api/api';
import '../styles/UploadProfile.css';

// Romantic/Matrimony-themed loading quotes
const loadingQuotes = [
  "Finding your perfect match...",
  "Love is in the air...",
  "Connecting hearts across the world...",
  "Building bridges between soulmates...",
  "Every profile is a story waiting to begin...",
  "Creating connections that last a lifetime...",
  "Your soulmate could be one click away...",
  "Bringing together hearts that beat as one...",
  "Where love stories begin...",
  "Matching dreams, creating futures...",
  "Two hearts, one journey...",
  "Discovering beautiful connections...",
  "Made for each other, found here...",
  "Crafting your love story...",
  "The perfect match is worth the wait..."
];

// Loading Quote Component with cycling animation
const LoadingQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % loadingQuotes.length);
    }, 3000); // Change quote every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-quotes-container">
      <div className="loading-spinner" />
      <AnimatePresence mode="wait">
        <motion.p
          key={currentQuote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="loading-quote-text"
        >
          {loadingQuotes[currentQuote]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

const UploadProfile = () => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('Bride');
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadReport, setUploadReport] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  if (!token) {
    navigate('/admin/login');
    return null;
  }

  useEffect(() => {
    // Cleanup preview URLs
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p));
    };
  }, [previews]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setError('');
    setFiles(selectedFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUploadReport(null);

    try {
      const result = await uploadBulkProfiles(files, category, token);

      if (result.success) {
        setSuccess(result.message);
        setUploadReport(result?.results || null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    // Cleanup preview URLs
    previews.forEach(p => URL.revokeObjectURL(p));
    // Clear all state
    setFiles([]);
    setPreviews([]);
    setError('');
    setSuccess('');
    setUploadReport(null);
    // Reset file input element
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <button onClick={handleBack} className="back-btn">← Back to Dashboard</button>

        <h1>Upload Profile</h1>
        <p className="subtitle">Image will be scanned for a code</p>

        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="image">Select Images</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              required
              disabled={loading}
              className="premium-file-input"
            />
            <p className="file-info">Supported: Images</p>
          </div>

          {previews.length > 0 && (
            <div className="preview-section">
              <p>Previewing {previews.length} file(s):</p>
              <div className="preview-grid">
                {previews.map((src, idx) => (
                  <img key={idx} src={src} alt="Preview" className="preview-image" />
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="premium-select"
            >
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {uploadReport && (
            <div className="info-box">
              <p>Upload Report</p>
              {Array.isArray(uploadReport.successes) && uploadReport.successes.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p>Successful</p>
                  <ol>
                    {uploadReport.successes.map((s, idx) => (
                      <li key={`s_${idx}`}>
                        {s.profileCode ? `${s.profileCode} - ` : ''}{s.filename}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {Array.isArray(uploadReport.errors) && uploadReport.errors.length > 0 && (
                <div>
                  <p>Failed</p>
                  <ol>
                    {uploadReport.errors.map((e, idx) => (
                      <li key={`e_${idx}`}>
                        {e.profileCode ? `${e.profileCode} - ` : ''}{e.filename} ({e.message})
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {uploadReport ? (
            <button type="button" onClick={handleComplete} className="upload-btn complete-btn">
              ✓ Completed
            </button>
          ) : (
            <button type="submit" disabled={loading} className="upload-btn">
              {loading ? <LoadingQuotes /> : '📤 Upload Profile'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadProfile;

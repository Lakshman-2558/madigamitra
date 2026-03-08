import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadBulkProfiles } from '../api/api';
import '../styles/UploadProfile.css';

const UploadProfile = () => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('Bride');
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

    // Validate
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validFiles = [];
    const newPreviews = [];

    selectedFiles.forEach(f => {
      if (allowedTypes.includes(f.type) && f.size <= 2 * 1024 * 1024) {
        validFiles.push(f);
        newPreviews.push(URL.createObjectURL(f));
      }
    });

    if (validFiles.length < selectedFiles.length) {
      setError(`Skipped ${selectedFiles.length - validFiles.length} invalid files (wrong type or >2MB).`);
    } else {
      setError('');
    }

    setFiles(validFiles);
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

    try {
      const result = await uploadBulkProfiles(files, category, token);

      if (result.success) {
        setSuccess(result.message);
        setFiles([]);
        setPreviews([]);

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
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
            <label htmlFor="image">Select Images (jpg, png) - Max 100 at a time</label>
            <input
              type="file"
              id="image"
              accept="image/jpeg, image/jpg, image/png"
              multiple
              onChange={handleFileChange}
              required
              disabled={loading}
              className="premium-file-input"
            />
            <p className="file-info">Max size per file: 2MB | Supported: JPG, JPEG, PNG</p>
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

          <button type="submit" disabled={loading} className="upload-btn">
            {loading ? '⏳ Uploading...' : '📤 Upload Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProfile;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadProfile } from '../api/api';
import '../styles/UploadProfile.css';

const UploadProfile = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Bride');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  if (!token) {
    navigate('/admin/login');
    return null;
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Only JPG, JPEG, PNG allowed');
      return;
    }

    // Validate file size
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an image');
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
      const result = await uploadProfile(file, category, token);

      if (result.success) {
        setSuccess(`Profile uploaded successfully! Code: ${result.profile.profileCode}`);
        setFile(null);
        setPreview('');
        setCategory('Bride');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
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
            <label htmlFor="image">Select Image (jpg, png)</label>
            <input
              type="file"
              id="image"
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleFileChange}
              required
              disabled={loading}
              className="premium-file-input"
            />
            <p className="file-info">Max size: 2MB | Supported: JPG, JPEG, PNG</p>
          </div>

          {preview && (
            <div className="preview-section">
              <p>Preview:</p>
              <img src={preview} alt="Preview" className="preview-image" />
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

        <div className="info-box">
          <p><strong>How it works:</strong></p>
          <ol>
            <li>Select clear image with code visible</li>
            <li>Choose category (Bride/Groom)</li>
            <li>Upload - OCR will extract the code automatically</li>
            <li>Code is extracted gracefully regardless of length</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;

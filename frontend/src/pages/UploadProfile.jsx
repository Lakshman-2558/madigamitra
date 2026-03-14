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

          <button type="submit" disabled={loading} className="upload-btn">
            {loading ? '⏳ Uploading...' : '📤 Upload Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProfile;

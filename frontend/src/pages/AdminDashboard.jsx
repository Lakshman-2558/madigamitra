import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProfiles, deleteProfile } from '../api/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');
  const username = localStorage.getItem('adminUsername');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchProfiles();
  }, [filterStatus, filterCategory]);

  const fetchProfiles = async () => {
    setLoading(true);
    setError('');

    try {
      const filters = {};

      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }

      if (filterCategory !== 'all') {
        filters.category = filterCategory;
      }

      const result = await getAllProfiles(token, filters);

      if (result.success) {
        setProfiles(result.profiles);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    setDeleting(profileId);

    try {
      const result = await deleteProfile(profileId, token);

      if (result.success) {
        setProfiles(profiles.filter(p => p._id !== profileId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  const handleUploadReroute = () => {
    navigate('/admin/upload');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome, <strong>{username}</strong></p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="back-public-btn">
            🌍 Public Catalog
          </button>
          <button onClick={handleUploadReroute} className="upload-btn">
            ➕ Upload Profile
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Bride">Bride</option>
            <option value="Groom">Groom</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading profiles...</div>
      ) : (
        <div className="profiles-section">
          {profiles.length === 0 ? (
            <div className="no-profiles">No profiles found</div>
          ) : (
            <div className="table-responsive">
              <table className="profiles-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Code</th>
                    <th>Sequence</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile._id} className={`row-${profile.status}`}>
                      <td>
                        <img src={profile.imageUrl} alt={profile.profileCode} />
                      </td>
                      <td className="code">{profile.profileCode}</td>
                      <td>{profile.sequenceNumber}</td>
                      <td>{profile.month}</td>
                      <td>{profile.year}</td>
                      <td>{profile.category}</td>
                      <td>
                        <span className={`status-badge ${profile.status}`}>
                          {profile.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(profile._id)}
                          disabled={deleting === profile._id}
                          className="delete-btn"
                        >
                          {deleting === profile._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

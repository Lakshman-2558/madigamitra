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
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10;

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
        setCurrentPage(1); // Reset page on new fetch
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

  const totalProfiles = profiles.length;
  const totalBrides = profiles.filter((p) => p.category === 'Bride').length;
  const totalGrooms = profiles.filter((p) => p.category === 'Groom').length;

  // Filter by search query
  const searchableProfiles = profiles.filter(p => {
    if (!searchQuery) return true;
    return p.profileCode.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate Pagination
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = searchableProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(searchableProfiles.length / profilesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-dashboard-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2 className="cinematic-font">MADIGAMITRA</h2>
          <p>Admin Portal</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">📊</span> Dashboard
          </div>
          <div className="nav-item" onClick={handleUploadReroute}>
            <span className="nav-icon">➕</span> Upload Profile
          </div>
          <div className="nav-item" onClick={() => navigate('/')}>
            <span className="nav-icon">🌍</span> Public Catalog
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{username ? username.charAt(0).toUpperCase() : 'A'}</div>
            <span>{username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="main-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, {username}. Here is what's happening today.</p>
          </div>
        </header>

        {/* STATS WIDGETS */}
        <div className="stats-container">
          <div className="stat-card total">
            <div className="stat-icon">📈</div>
            <div className="stat-details">
              <h3>{totalProfiles}</h3>
              <p>Total Profiles</p>
            </div>
          </div>
          <div className="stat-card brides">
            <div className="stat-icon">👰</div>
            <div className="stat-details">
              <h3>{totalBrides}</h3>
              <p>Brides</p>
            </div>
          </div>
          <div className="stat-card grooms">
            <div className="stat-icon">🤵</div>
            <div className="stat-details">
              <h3>{totalGrooms}</h3>
              <p>Grooms</p>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="content-area">
          <div className="content-header">
            <h2>Profiles Directory</h2>
            <div className="filters-glass">
              <div className="filter-group hide-mobile-label">
                <input
                  type="text"
                  placeholder="Search by Code..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input-glass"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="status">Status:</label>
                <select id="status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="category">Category:</label>
                <select id="category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">All</option>
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading profiles...</div>
          ) : (
            <div className="table-responsive">
              {currentProfiles.length === 0 ? (
                <div className="no-profiles">No profiles found</div>
              ) : (
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
                    {currentProfiles.map((profile) => (
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
              )}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {!loading && totalPages > 1 && (
            <div className="pagination-container">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Prev
              </button>

              <span className="pagination-info">
                Page <span className="highlight">{currentPage}</span> of {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

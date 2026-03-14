import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProfileCard from '../components/ProfileCard';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { searchQuery, searchType, brides = [], grooms = [] } = location.state || {};

  const formatYear = (y) => {
    let yr = parseInt(y, 10);
    if (!isNaN(yr)) {
      if (yr >= 0 && yr <= 25) return `20${String(yr).padStart(2, '0')}`;
      if (yr > 25 && yr <= 99) return `19${String(yr).padStart(2, '0')}`;
    }
    return y;
  };

  if (!searchQuery) {
    return (
      <div className="results-container dark-premium-theme">
        <div className="ambient-glow glow-1"></div>
        <div className="results-content">
          <button onClick={() => navigate('/')} className="btn-back-glass">
            ← Back to Home
          </button>
          <div className="empty-state">No search performed. Please return to the home page.</div>
        </div>
      </div>
    );
  }

  const total = brides.length + grooms.length;

  return (
    <div className="results-container dark-premium-theme">
      {/* Abstract Ambient Glows */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      <div className="results-content">
        <header className="results-header">
          <button onClick={() => navigate('/')} className="btn-back-glass">
            ← Back to Home
          </button>
          <div className="results-header-text">
            <h1 className="cinematic-title results-main-title">
              Search Results
            </h1>
            <p className="cinematic-subtitle">
              {searchType === 'year' ? `Year ${formatYear(searchQuery)}` : `Code ${searchQuery}`}
            </p>
          </div>
        </header>

        <motion.div
          className="results-summary-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="summary-stat">
            <span className="stat-label">Total Found</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-stat">
            <span className="stat-label">Brides</span>
            <span className="stat-value">{brides.length}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-stat">
            <span className="stat-label">Grooms</span>
            <span className="stat-value">{grooms.length}</span>
          </div>
        </motion.div>

        <motion.div
          className="results-lists"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Brides Section */}
          {brides.length > 0 && (
            <section className="category-section">
              <div className="category-header-glass">
                <h2 className="view-category-title">👰 Brides - Born Year {formatYear(searchQuery)}</h2>
              </div>
              <div className="profiles-grid-scrollable">
                {brides.map((profile) => (
                  <div key={profile._id} className="profile-wrapper">
                    <ProfileCard profile={profile} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Grooms Section */}
          {grooms.length > 0 && (
            <section className="category-section">
              <div className="category-header-glass">
                <h2 className="view-category-title">🤵 Grooms - Born Year {formatYear(searchQuery)}</h2>
              </div>
              <div className="profiles-grid-scrollable">
                {grooms.map((profile) => (
                  <div key={profile._id} className="profile-wrapper">
                    <ProfileCard profile={profile} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {total === 0 && (
            <div className="empty-state">
              <p>No profiles found for "{searchQuery}"</p>
              <button onClick={() => navigate('/')} className="btn-explore mt-4">
                Try Another Search
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResults;

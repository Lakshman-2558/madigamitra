import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { searchQuery, searchType, brides = [], grooms = [] } = location.state || {};

  if (!searchQuery) {
    return (
      <div className="results-container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Home
        </button>
        <div className="no-results">No search performed. Please search from home page.</div>
      </div>
    );
  }

  const total = brides.length + grooms.length;

  return (
    <div className="results-container">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Home
      </button>

      <h1 className="results-title">
        Search Results: {searchType === 'year' ? `Year ${searchQuery}` : `Code ${searchQuery}`}
      </h1>

      <div className="results-summary">
        Total Found: <strong>{total}</strong> | Brides: <strong>{brides.length}</strong> | Grooms: <strong>{grooms.length}</strong>
      </div>

      {/* Brides Section */}
      {brides.length > 0 && (
        <section className="category-section">
          <h2 className="category-title">👰 Brides - Year {searchQuery}</h2>
          <div className="profiles-grid">
            {brides.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Grooms Section */}
      {grooms.length > 0 && (
        <section className="category-section">
          <h2 className="category-title">🤵 Grooms - Year {searchQuery}</h2>
          <div className="profiles-grid">
            {grooms.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="no-results">
          <p>No profiles found for "{searchQuery}"</p>
          <button onClick={() => navigate('/')} className="search-again-btn">
            Try Another Search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

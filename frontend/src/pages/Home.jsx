import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublicProfiles } from '../api/api';
import ProfileCard from '../components/ProfileCard';
import '../styles/Home.css';

// SVG Search Icon
const SearchIcon = () => (
  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const HomeSparkleParticles = ({ count = 30 }) => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: Math.random() * 2 + 3,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, [count]);
  return (
    <div className="home-sparkle-layer">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="home-sparkle-particle"
          style={{ left: p.left, top: p.top }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const HomeButterfly = ({ isVisible }) => {
  const [introDone, setIntroDone] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let timer;
    // Only run intro timeout if the butterfly is actually visible.
    if (isVisible && !introDone) {
      timer = setTimeout(() => {
        setIntroDone(true);
      }, 3500); // Wait for the initial 3.5s flight path to complete
    }
    return () => clearTimeout(timer);
  }, [isVisible, introDone]);

  if (!isVisible) return null;

  // The butterfly base CSS position is top: '15%', right: '15%'
  // This causes the coordinates below to effectively be relative to that coordinate.
  // The buttons are effectively placed below and to the left of this root coordinate.
  const initialFlightX = isMobile ? ['-90vw', '-40vw', '-20vw', '-40vw', 0] : ['-80vw', '-40vw', '-20vw', '-40vw', 0];
  const initialFlightY = isMobile ? ['50vh', '35vh', '45vh', '35vh', 0] : ['60vh', '40vh', '50vh', '40vh', 0];

  return (
    <motion.div
      style={{ position: 'absolute', zIndex: 50, pointerEvents: 'none', top: '15%', right: '15%' }}
      initial={{ x: '-100vw', y: '60vh', scale: 0.2, rotate: 45, opacity: 0 }}
      animate={introDone ? {
        x: 0,
        y: [0, -15, 0],
        rotate: 0,
        scale: 1,
        opacity: 1
      } : {
        x: initialFlightX,
        y: initialFlightY,
        rotate: [45, 10, -20, 10, 0],
        scale: [0.2, 1.2, 1, 1.2, 1],
        opacity: [0, 1, 1, 1, 1]
      }}
      transition={introDone
        ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        : { duration: 3.5, ease: "easeInOut" }
      }
    >
      <svg width="80" height="80" viewBox="0 0 100 100" fill="url(#violet-img-grad)" className="butterfly-wings butterfly-svg">
        <defs>
          <linearGradient id="violet-img-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b28ceb" />
            <stop offset="50%" stopColor="#9b5de5" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
        <path d="M50 45 C 35 15, 10 10, 15 45 C 18 55, 30 75, 45 60 C 48 56, 50 50, 50 50 L 50 50 C 50 50, 52 56, 55 60 C 70 75, 82 55, 85 45 C 90 10, 65 15, 50 45 Z" />
        <path d="M48 30 C 49 15, 51 15, 52 30 C 53 45, 51 65, 50 65 C 49 65, 47 45, 48 30 Z" fill="#4B0082" />
      </svg>
    </motion.div>
  );
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fetch Brides by default if requested, or just wait for click

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    setError('');

    try {
      const result = await getPublicProfiles(category);
      if (result.success) {
        setProfiles(category === 'Bride' ? result.brides.profiles : result.grooms.profiles);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.trim();
    if (q.length === 2 && p.year === parseInt(q, 10)) return true;
    if (p.profileCode.includes(q)) return true;
    return false;
  });

  const groupedProfiles = filteredProfiles.reduce((acc, profile) => {
    const year = profile.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(profile);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedProfiles).sort((a, b) => b - a);

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="wave-overlay wave-top"></div>
      <div className="wave-overlay wave-bottom"></div>

      <HomeSparkleParticles count={40} />
      <HomeButterfly isVisible={!selectedCategory} />

      {!selectedCategory ? (
        <>
          <header className="home-header">
            <div className="home-header-typography">
              <span className="script-font">MadigaMitra</span>
              <span className="serif-font">Matrimony</span>
            </div>
            <p className="landing-subtitle">Where Love Begins Forever</p>
          </header>

          <div className="category-selection">
            <h2 className="category-title">Select Profiles</h2>

            <div className="category-buttons" style={{ marginTop: '50px' }}>
              <button
                className="btn-cat btn-bride-cat"
                onClick={() => handleCategorySelect('Bride')}
              >
                👰 Bride
              </button>
              <button
                className="btn-cat btn-groom-cat"
                onClick={() => handleCategorySelect('Groom')}
              >
                🤵 Groom
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="profiles-view" style={{ paddingTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '0 40px' }}>
            <h2 className="category-title" style={{ margin: 0 }}>Showing {selectedCategory}s</h2>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{ background: 'white', border: '1px solid #c084fc', padding: '10px 24px', borderRadius: '30px', color: '#6a28b0', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}
            >
              ← Pick Another Category
            </button>
          </div>

          {loading ? (
            <div className="premium-empty animate-pulse">
              Discovering elite profiles...
            </div>
          ) : error ? (
            <div className="premium-empty" style={{ color: 'red' }}>{error}</div>
          ) : sortedYears.length > 0 ? (
            sortedYears.map((yearStr) => (
              <div key={yearStr} className="year-section">
                <h2 className="category-title" style={{ justifyContent: 'flex-start', fontSize: '1.4rem' }}>
                  Year {yearStr} <span style={{ marginLeft: '15px', fontSize: '0.9rem', background: 'rgba(167, 139, 250, 0.15)', padding: '4px 12px', borderRadius: '20px' }}>{groupedProfiles[yearStr].length} Profiles</span>
                </h2>

                <div className="year-row">
                  {groupedProfiles[yearStr].map(p => (
                    <div key={p._id} className="profile-wrapper">
                      <ProfileCard profile={p} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="premium-empty">
              No profiles found matching "{searchQuery}".
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Home;

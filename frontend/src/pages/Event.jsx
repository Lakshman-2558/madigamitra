import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Event.css';

const Event = () => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Auto-navigate after 12 seconds
    const websiteTimer = setTimeout(() => {
      enterWebsite();
    }, 12000);

    return () => {
      clearTimeout(websiteTimer);
    };
  }, [navigate]);

  const enterWebsite = () => {
    if (redirecting) return;
    setRedirecting(true);

    // Smooth transition to /home
    setTimeout(() => {
      navigate('/home');
    }, 800);
  };

  return (
    <div className="event-page-container">
      <div className="event-page-overlay" style={{ backgroundImage: 'url(/event-poster.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, filter: 'blur(10px)' }}></div>

      <motion.div
        className="event-content-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="event-header">
          <h1 className="event-title cinematic-font">ETMDs Madiga Vivaha Parichaya Vedika</h1>
          <p className="event-subtitle">A Grand Launch Event</p>
        </div>

        <button onClick={enterWebsite} className="event-skip-btn">
          Skip
        </button>

        <motion.div
          className="event-poster-large"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: redirecting ? 0 : 1,
            scale: redirecting ? 1.05 : 1,
            filter: redirecting ? 'blur(20px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.8 }}
        >
          <div className={`poster-skeleton ${imgLoaded ? 'hidden' : ''}`}>
            <div className="shimmer"></div>
            <p>Loading Poster...</p>
          </div>
          <img
            src="/event-poster.jpg"
            alt="ETMDs Madiga Vivaha Parichaya Vedika - Special Event"
            className={`event-poster-full ${imgLoaded ? 'loaded' : ''}`}
            onLoad={() => setImgLoaded(true)}
            onClick={enterWebsite}
            style={{ cursor: 'pointer' }}
          />

          {redirecting && (
            <motion.div
              className="redirect-notice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Entering Website...
            </motion.div>
          )}
        </motion.div>

        <div className="event-cta-section">
          <motion.button
            onClick={enterWebsite}
            className="enter-website-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter Website
          </motion.button>
        </div>

        <motion.div
          className="event-info-cards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="info-card">
            <div className="info-icon">📅</div>
            <h3>Date</h3>
            <p>19 March 2026</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Venue</h3>
            <p>APSEB Engineers Association Guest House</p>
            <p className="venue-address">Morampudi, Rajahmundry</p>
          </div>

          <div className="info-card">
            <div className="info-icon">🤝</div>
            <h3>Organized By</h3>
            <p>ETMDs</p>
            <p className="org-full">Economics Times for Maha Development</p>
          </div>
        </motion.div>

        <motion.div
          className="event-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="launch-countdown">
            <div className="counting-glow"></div>
            <p>Launching the Official Catalog in few seconds...</p>
          </div>
        </motion.div>

        <motion.div
          className="event-contact-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2>మరింతము సమాచార్ కోసం</h2>
          <div className="contact-details">
            <p><span className="contact-label">ఫోన్:</span> 7661991199</p>
            <p><span className="contact-label">వాట్సప్ప్:</span> 9666788199</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Event;

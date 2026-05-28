import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ProfileCard.css';

const ProfileCard = ({ profile, rowProfiles = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (rowProfiles && profile) {
        const idx = rowProfiles.findIndex(p => p._id === profile._id);
        setCurrentIndex(idx !== -1 ? idx : 0);
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, rowProfiles, profile]);

  const handleNext = (e) => {
    e.stopPropagation();
    if (rowProfiles && currentIndex < rowProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (rowProfiles && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentProfile = rowProfiles && isOpen ? rowProfiles[currentIndex] : profile;

  return (
    <>
      <div className="profile-card" onClick={() => setIsOpen(true)}>
        <div className="image-container">
          <img
            src={profile.imageUrl}
            alt={profile.profileCode}
            loading="lazy"
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="profile-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setIsOpen(false)}>×</button>

              {rowProfiles && currentIndex > 0 && (
                <button className="modal-nav-btn prev-btn" onClick={handlePrev}>
                  &#10094;
                </button>
              )}

              <img
                key={currentProfile._id}
                src={currentProfile.imageUrl}
                alt={currentProfile.profileCode}
                className="modal-image"
              />

              {rowProfiles && currentIndex < rowProfiles.length - 1 && (
                <button className="modal-nav-btn next-btn" onClick={handleNext}>
                  &#10095;
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileCard;

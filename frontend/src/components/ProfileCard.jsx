import React from 'react';
import '../styles/ProfileCard.css';

const ProfileCard = ({ profile }) => {
  return (
    <div className="profile-card">
      <div className="image-container">
        <img
          src={profile.imageUrl}
          alt={profile.profileCode}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default ProfileCard;

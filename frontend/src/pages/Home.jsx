import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicProfiles } from '../api/api';
import ProfileCard from '../components/ProfileCard';
import '../styles/Home.css';

// Generate perfect mathematical elliptical orbit coordinates
const orbitX = [];
const orbitY = [];
const orbitRotate = [];
const radiusX = 300;
const radiusY = 190;

for (let i = 0; i <= 360; i += 5) {
  // Start at the top: angle = -90 degrees
  const rad = (i - 90) * (Math.PI / 180);

  const x = Math.cos(rad) * radiusX;
  const y = Math.sin(rad) * radiusY;

  // Tangent direction for smooth rotation
  const dx = -radiusX * Math.sin(rad);
  const dy = radiusY * Math.cos(rad);
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Add offset to orient the static SVG appropriately along the tangent
  angle += 90;

  orbitX.push(x);
  orbitY.push(y);
  orbitRotate.push(angle);
}

// SVG Search Icon
const SearchIcon = () => (
  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const GroomIcon = () => (
  <div className="icon-wrapper groom-icon-wrapper">
    <img src="/Groom-new.png" alt="Groom" className="category-icon-img" />
  </div>
);

const BrideIcon = () => (
  <div className="icon-wrapper bride-icon-wrapper">
    <img src="/Bride.png" alt="Bride" className="category-icon-img" />
  </div>
);

const LogoM = () => (
  <div style={{ width: '130px', height: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <img src="/logo.png" alt="Logo" style={{ height: '100%', width: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }} />
  </div>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '12px', marginRight: '8px', verticalAlign: 'middle' }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const SparkleParticles = ({ count = 30 }) => {
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
    <div className="sparkle-layer">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="sparkle-particle"
          style={{ left: p.left, top: p.top }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const ButterflyTail = ({ isFlying, isMobile }) => {
  if (!isFlying) return null;
  return (
    <>
      {[...Array(60)].map((_, i) => {
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        return (
          <motion.div
            key={`trail-${i}`}
            className="trail-particle"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: isMobile
                ? [0, 50 + offsetX, 100 + offsetX, 150 + offsetX, 100 + offsetX, 50 + offsetX, -50 + offsetX, -100 + offsetX, -50 + offsetX, 0]
                : [0, 100 + offsetX, 200 + offsetX, 300 + offsetX, 250 + offsetX, 150 + offsetX, 100 + offsetX, 150 + offsetX, 260 + offsetX],
              y: isMobile
                ? [0, 100 + offsetY, 200 + offsetY, 400 + offsetY, 600 + offsetY, 700 + offsetY, 750 + offsetY, 700 + offsetY, 650 + offsetY, 800 + offsetY]
                : [0, 150 + offsetY, 300 + offsetY, 450 + offsetY, 600 + offsetY, 750 + offsetY, 800 + offsetY, 750 + offsetY, 880 + offsetY],
              opacity: [0, 1, 0.9, 1, 0.8, 0.5, 0.7, 0.4, 0],
              scale: [0.1, 1.5, 1.2, 0.8, 0.6, 0.8, 0.5, 0.3, 0]
            }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: (i * 0.02) }}
            style={{ position: 'absolute', top: 25, left: 25 }}
          />
        );
      })}
    </>
  );
};

const Butterfly = ({ triggerFlight, onArrival }) => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const flightVariants = {
    idle: {
      y: [0, -8, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    flying: {
      x: isMobile
        ? [0, 50, 100, 150, 100, 50, -50, -100, -50, 0]
        : [0, 100, 200, 300, 250, 150, 100, 150, 260],
      y: isMobile
        ? [0, 100, 200, 400, 600, 700, 750, 700, 650, 800]
        : [0, 150, 300, 450, 600, 750, 800, 750, 880], // swoop down to touch the groom button
      rotate: [0, 45, -20, 20, -45, 60, -60, 20, 0],
      scale: [1, 1.2, 1.5, 1, 1.5, 1, 1.2, 1, 0],
      opacity: [1, 1, 1, 1, 1, 1, 1, 1, 0],
      transition: { duration: 3.5, ease: "easeInOut" }
    }
  };

  return (
    <div className="butterfly-container">
      <motion.div
        variants={flightVariants}
        initial="idle"
        animate={triggerFlight ? "flying" : "idle"}
        onAnimationComplete={(def) => {
          if (def === "flying" && onArrival) onArrival();
        }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <svg width="60" height="60" viewBox="0 0 100 100" className={`butterfly-svg butterfly-wings ${triggerFlight ? 'flying' : ''}`} fill="url(#violet-grad)">
          <defs>
            <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="50%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <path d="M50 45 C 35 15, 10 10, 15 45 C 18 55, 30 75, 45 60 C 48 56, 50 50, 50 50 L 50 50 C 50 50, 52 56, 55 60 C 70 75, 82 55, 85 45 C 90 10, 65 15, 50 45 Z" />
          <path d="M48 30 C 49 15, 51 15, 52 30 C 53 45, 51 65, 50 65 C 49 65, 47 45, 48 30 Z" fill="#fff" />
        </svg>
      </motion.div>
      <ButterflyTail isFlying={triggerFlight} isMobile={isMobile} />
    </div>
  );
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [butterflyFlying, setButterflyFlying] = useState(false);
  const [cardGlow, setCardGlow] = useState(false);
  const [homeBgActive, setHomeBgActive] = useState(false);
  const [butterflyStage, setButterflyStage] = useState('idle');

  const homeSectionRef = useRef(null);
  const categoryButtonsRef = useRef(null);
  const heroSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = homeSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only set false if we completely scrolled out (top of page)
        if (entry.isIntersecting) {
          setHomeBgActive(true);
        } else if (window.scrollY < 100) {
          setHomeBgActive(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setButterflyFlying(false);
          setButterflyStage('idle');
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 1. Silent unlocker for Chrome Autoplay Policy
    const unlockAudio = () => {
      if ('speechSynthesis' in window) {
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // 2. 5-Second Timer
    if (selectedCategory) return;

    const timer = setTimeout(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const message = new SpeechSynthesisUtterance("వధూవరుల ప్రొఫైల్లను చూడటానికి, కిందకు స్క్రోల్ చేయండి లేదా 'Explore' బటన్ను క్లిక్ చేయండి.");
        message.lang = 'te-IN';
        message.rate = 0.9;

        window.speechSynthesis.speak(message);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, [selectedCategory]);

  const handleExplore = () => {
    if (butterflyFlying) return;
    setButterflyFlying(true);
    setButterflyStage('flyingToHome');
    setHomeBgActive(true); // Force background to show definitively

    // Smooth scroll down to Home section while butterfly animates
    setTimeout(() => {
      homeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 400); // Slight delay so butterfly starts first
  };

  const handleButterflyArrival = () => {
    setCardGlow(true);
    setTimeout(() => {
      setCardGlow(false);
      setButterflyStage('parked');
      setButterflyFlying(false);
    }, 2000);
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'instant' });

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

  const formatYear = (y) => {
    let yr = parseInt(y, 10);
    if (!isNaN(yr)) {
      if (yr >= 0 && yr <= 25) return `20${String(yr).padStart(2, '0')}`;
      if (yr > 25 && yr <= 99) return `19${String(yr).padStart(2, '0')}`;
    }
    return y;
  };

  const filteredProfiles = profiles.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.trim();

    // Check original 2-digit format
    if (q.length === 2 && p.year === parseInt(q, 10)) return true;

    // Check 4-digit format (e.g. '2000' or '1998')
    if (q.length === 4 && formatYear(p.year) === q) return true;

    // Check if profile code contains query
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

  // If a category is selected, view profiles directly (replaces scroll layout)
  if (selectedCategory) {
    return (
      <div className="home-container">
        <motion.div
          className="profiles-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="profiles-header-container">
            <button onClick={() => setSelectedCategory(null)} className="btn-back-glass">
              <span className="back-arrow">←</span> Select Category
            </button>
            <h2 className="view-category-title">{selectedCategory} Profiles</h2>
            <div className="search-bar-glass">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by ID or Year (e.g. 1998)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="profiles-content-scroll">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading premium profiles...</p>
              </div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : sortedYears.length > 0 ? (
              sortedYears.map((yearStr) => (
                <div key={yearStr} className="year-section">
                  <div className="year-header">
                    <h3 className="year-title">Born Year {formatYear(yearStr)}</h3>
                    <span className="year-badge">{groupedProfiles[yearStr].length}</span>
                  </div>
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
              <div className="empty-state">
                <p>No profiles found matching your search.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Vertical scrollable layout
  return (
    <div className="home-container">
      <div className={homeBgActive ? 'home-bg-layer active' : 'home-bg-layer'} aria-hidden="true" />

      {/* =========================================================
          SECTION 1: HERO LANDING BANNER
      ========================================================= */}
      <section className="hero-section" id="hero">
        <div ref={heroSectionRef} style={{ position: 'absolute', inset: 0 }} />
        <div className="hero-overlay"></div>
        <div className="wave-gradient-overlay"></div>
        <SparkleParticles count={40} />

        <div className="hero-content">
          <motion.div
            className="brand-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="brand-title cinematic-font">MADIGAMITRA</h2>
            <p className="brand-subtitle">MATRIMONY</p>
          </motion.div>

          <motion.div
            className="hero-title-wrapper"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="hero-radial-glow"></div>
            <h2 className="hero-subtitle">Connecting <span className="highlight-text">MADIGA Soulmates</span> Across the World</h2>
          </motion.div>

          <div className="explore-btn-wrapper">
            <motion.button
              className="explore-btn"
              onClick={handleExplore}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Let's Explore
            </motion.button>

            <motion.div
              className={
                butterflyStage === 'orbiting'
                  ? 'butterfly-orbit'
                  : butterflyStage === 'parked'
                    ? 'butterfly-parked'
                    : 'butterfly-on-explore'
              }
              initial={false}
              animate={
                butterflyStage === 'orbiting'
                  ? {
                    x: orbitX,
                    y: orbitY,
                    rotate: orbitRotate,
                    opacity: 1
                  }
                  : butterflyStage === 'parked'
                    ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 0.85 }
                    : { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } // Do nothing for idle/flying, let Butterfly handle it natively
              }
              transition={
                butterflyStage === 'orbiting'
                  ? { duration: 2.6, ease: 'linear' }
                  : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              }
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <Butterfly
                triggerFlight={butterflyStage === 'flyingToHome'}
                onArrival={handleButterflyArrival}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Butterfly is now anchored to the explore button */}

      {/* =========================================================
          SECTION 2: HORIZONTAL MATRIMONY BANNER
      ========================================================= */}
      <section className="marquee-section">
        <div className="marquee-content">
          <span className="marquee-item">MADIGAMITRA Matrimony</span>
          <span className="marquee-item">•</span>
          <span className="marquee-item">Perfect Matches</span>
          <span className="marquee-item">•</span>
          <span className="marquee-item">పరిచయం మాది, పరిణయం మీది.</span>
          <span className="marquee-item">•</span>
          <span className="marquee-item">మాదిగ మిత్ర మ్యాట్రిమోనీ</span>
          <span className="marquee-item">•</span>
          <span className="marquee-item">Perfect Matches</span>
          <span className="marquee-item">•</span>
          <span className="marquee-item">పరిచయం మాది, పరిణయం మీది.</span>
          <span className="marquee-item">•</span>
          {/* Duplicating for smooth looping */}
          <span className="marquee-item">MADIGAMITRA Matrimony</span>
          <span className="marquee-item">•</span>
          <span className="marquee-item">Perfect Matches</span>
          <span className="marquee-item">•</span>
          <span className="marquee-item">పరిచయం మాది, పరిణయం మీది.</span>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: HOME SECTION (Categories)
      ========================================================= */}
      <section className="home-section" ref={homeSectionRef} id="selection">
        <SparkleParticles count={20} />

        <motion.h2
          className="section-title cinematic-font"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          Find Your Perfect Match
        </motion.h2>

        <motion.div
          className="category-buttons"
          ref={categoryButtonsRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <button
            className="btn-glass btn-bride"
            onClick={() => handleCategorySelect('Bride')}
            style={cardGlow ? { boxShadow: '0 0 50px rgba(124, 58, 237, 0.8)' } : {}}
          >
            <div className="btn-glass-inner">
              <div className="btn-icon">
                <BrideIcon />
              </div>
              <span className="btn-text">Bride</span>
            </div>
          </button>

          <button
            className="btn-glass btn-groom"
            onClick={() => handleCategorySelect('Groom')}
            style={cardGlow ? { boxShadow: '0 0 50px rgba(124, 58, 237, 0.8)' } : {}}
          >
            <div className="btn-glass-inner">
              <div className="btn-icon">
                <GroomIcon />
              </div>
              <span className="btn-text">Groom</span>
            </div>
          </button>
        </motion.div>
      </section>

      {/* =========================================================
          SECTION 4: FOOTER
      ========================================================= */}
      <footer className="footer-section">
        <div className="footer-glow-divider"></div>

        <div className="footer-logo">
          <LogoM />
        </div>
        <h3 className="footer-title cinematic-font">MADIGAMITRA</h3>
        <p className="footer-subtitle">Connecting Soulmates Forever</p>

        <p className="footer-mission">
          సమాచార కొరతతో దూరమవుతున్న సంబంధాలను మెరుగుపరచడానికి మన బంధు మిత్రులను ప్రోత్సహించడం కోసం అచ్చమైన పదహారణాల మాదిగ కుటుంబాల నుండి వివాహం కొరకు ఎదురు చూస్తున్న నవ యువతీ యువకుల సమగ్ర సమాచారం సేకరించి వివాహ ముందస్తు పరిచయ వేదికను ఏర్పాటుచేయవలెనని మా దృఢమైన సంకల్పం
        </p>

        {/* <div className="footer-social-icons">
          <div className="social-icon-box"><InstagramIcon /></div>
          <div className="social-icon-box"><FacebookIcon /></div>
          <div className="social-icon-box"><XIcon /></div>
        </div> */}

        <div className="footer-gold-line"></div>
        <p className="footer-contact">
          <PhoneIcon /> 7661991199 | <WhatsAppIcon /> 9666788199
        </p>
        <p className="footer-copyright">&copy; {new Date().getFullYear()} MADIGAMITRA. All rights reserved.</p>
        <p className="footer-wintage">Developed by <a href="https://wintage.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#eab308', textDecoration: 'none' }}>Wintage Developers</a></p>

        {/* Small floating butterflies in footer */}
        <div style={{ position: 'absolute', bottom: '20px', left: '20%', opacity: 0.5, transform: 'scale(0.3) rotate(-20deg)' }}>
          <svg width="60" height="60" viewBox="0 0 100 100" fill="#c4b5fd" className="butterfly-wings">
            <path d="M50 45 C 35 15, 10 10, 15 45 C 18 55, 30 75, 45 60 C 48 56, 50 50, 50 50 L 50 50 C 50 50, 52 56, 55 60 C 70 75, 82 55, 85 45 C 90 10, 65 15, 50 45 Z" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: '40px', right: '15%', opacity: 0.4, transform: 'scale(0.4) rotate(30deg)' }}>
          <svg width="60" height="60" viewBox="0 0 100 100" fill="#e9d5ff" className="butterfly-wings">
            <path d="M50 45 C 35 15, 10 10, 15 45 C 18 55, 30 75, 45 60 C 48 56, 50 50, 50 50 L 50 50 C 50 50, 52 56, 55 60 C 70 75, 82 55, 85 45 C 90 10, 65 15, 50 45 Z" />
          </svg>
        </div>


        <div onClick={() => navigate('/admin/login')} className="admin-login-trigger">A</div>
      </footer>
    </div>
  );
};

export default Home;

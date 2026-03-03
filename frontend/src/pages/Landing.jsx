import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Landing.css';

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
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
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
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={`trail-${i}`}
                    className="trail-particle"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                        x: isMobile ? [0, 80, 200, 100, 250, 350, 500] : [0, 150, 400, 200, 600, 900, 1800],
                        y: isMobile ? [0, -80, -30, -200, -100, -250, -600] : [0, -150, -50, -350, -150, -400, -900],
                        opacity: [0, 1, 0.9, 1, 0.8, 0.5, 0],
                        scale: [0.3, 1.2, 0.8, 1, 0.6, 0.3, 0.1]
                    }}
                    transition={{ duration: 2, ease: "easeInOut", delay: (i * 0.04) }}
                />
            ))}
        </>
    );
};

const Landing = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSeeMore = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        // Allow butterfly to fly for 1.8s then trigger transition
        setTimeout(() => {
            navigate('/home');
        }, 1800);
    };

    return (
        <motion.div
            className="landing-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
            {/* Curved Ribbons matching mockup */}
            <div className="ribbon ribbon-1"></div>
            <div className="ribbon ribbon-2"></div>
            <div className="ribbon ribbon-3"></div>

            {/* Background Sparkle Layers */}
            <SparkleParticles count={40} />

            {/* Center Content Typography */}
            <div className="landing-content">
                <div className="text-glow-wrapper"></div>
                <motion.h1
                    className="landing-title"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="floating-title">
                        <motion.span
                            className="script-font"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                        >
                            MadigaMitra
                        </motion.span>
                        <span className="serif-font">Matrimony</span>
                    </div>
                </motion.h1>
                <motion.p
                    className="landing-subtitle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                >
                    Where Love Begins Forever
                </motion.p>
            </div>

            {/* Action Button Container */}
            <motion.div
                className="btn-see-more-container"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            >
                <button className="btn-see-more" onClick={handleSeeMore}>
                    SEE MORE &gt;
                </button>

                {/* Butterfly attached to button */}
                <motion.div
                    className="butterfly-wrapper"
                    initial={false}
                    animate={isTransitioning ? {
                        x: isMobile ? [0, 80, 200, 100, 250, 350, 500] : [0, 150, 400, 200, 600, 900, 1800],
                        y: isMobile ? [0, -80, -30, -200, -100, -250, -600] : [0, -150, -50, -350, -150, -400, -900],
                        rotate: [0, 20, 360, 45, -20, 360, 45],
                        scale: [1, 1.2, 1.2, 1.5, 1.2, 1, 0.5]
                    } : {
                        y: [0, -6, 0] // subtle vertical float
                    }}
                    transition={isTransitioning
                        ? { duration: 2, ease: "easeInOut" }
                        : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                    }
                >
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 100 100"
                        fill="url(#img-realistic-gradient)"
                        className={isTransitioning ? "butterfly-wings butterfly-svg" : "butterfly-wings butterfly-svg"}
                    >
                        <defs>
                            <linearGradient id="img-realistic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#b28ceb" />
                                <stop offset="50%" stopColor="#9b5de5" />
                                <stop offset="100%" stopColor="#7e22ce" />
                            </linearGradient>
                        </defs>
                        <path d="M50 45 
                     C 35 15, 10 10, 15 45 
                     C 18 55, 30 75, 45 60 
                     C 48 56, 50 50, 50 50 
                     L 50 50 
                     C 50 50, 52 56, 55 60 
                     C 70 75, 82 55, 85 45 
                     C 90 10, 65 15, 50 45 Z" />
                        <path d="M48 30 C 49 15, 51 15, 52 30 C 53 45, 51 65, 50 65 C 49 65, 47 45, 48 30 Z" fill="#4B0082" />
                    </svg>
                </motion.div>

                {/* Trail emitted on click */}
                <div style={{ position: 'absolute', top: -5, right: 15, pointerEvents: 'none' }}>
                    <ButterflyTail isFlying={isTransitioning} isMobile={isMobile} />
                </div>
            </motion.div>

            {/* Discreet Admin Access Link */}
            <div
                onClick={() => navigate('/admin/login')}
                style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '20px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    zIndex: 100,
                    textDecoration: 'none',
                    userSelect: 'none'
                }}
            >
                A
            </div>
        </motion.div>
    );
};

export default Landing;

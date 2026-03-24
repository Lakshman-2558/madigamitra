import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
            {[...Array(60)].map((_, i) => {
                const offsetX = Math.random() * 20 - 10;
                const offsetY = Math.random() * 20 - 10;
                return (
                    <motion.div
                        key={`trail-${i}`}
                        className="rocket-fire-particle"
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: isMobile ? [0, 80 + offsetX, 200 + offsetX, 100 + offsetX, 250 + offsetX, 350 + offsetX, 500 + offsetX] : [0, 150 + offsetX, 400 + offsetX, 200 + offsetX, 600 + offsetX, 900 + offsetX, 1800 + offsetX],
                            y: isMobile ? [0, -80 + offsetY, -30 + offsetY, -200 + offsetY, -100 + offsetY, -250 + offsetY, -600 + offsetY] : [0, -150 + offsetY, -50 + offsetY, -350 + offsetY, -150 + offsetY, -400 + offsetY, -900 + offsetY],
                            opacity: [0, 1, 0.9, 1, 0.8, 0.5, 0],
                            scale: [0.1, 1.8, 1.4, 0.9, 0.5, 0.2, 0]
                        }}
                        transition={{ duration: 2, ease: "easeOut", delay: (i * 0.02) }}
                        style={{
                            position: 'absolute',
                            top: 25,
                            left: 25
                        }}
                    />
                );
            })}
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

    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [hasInteractedWithAudio, setHasInteractedWithAudio] = useState(false);

    const toggleAudio = () => {
        setHasInteractedWithAudio(true);
        if ('speechSynthesis' in window) {
            if (isAudioPlaying) {
                window.speechSynthesis.cancel();
                setIsAudioPlaying(false);
            } else {
                window.speechSynthesis.cancel();
                const message = new SpeechSynthesisUtterance("వధూవరుల ప్రొఫైల్లను చూడటానికి, కిందకు స్క్రోల్ చేయండి లేదా 'Explore' బటన్ను క్లిక్ చేయండి.");
                message.lang = 'te-IN';
                message.rate = 0.9;
                message.onend = () => setIsAudioPlaying(false);
                window.speechSynthesis.speak(message);
                setIsAudioPlaying(true);
            }
        }
    };

    const handleExplore = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
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
            {/* Speaker Control */}
            <div className="speaker-symbol-wrapper">
                <button 
                    className={`speaker-btn ${isAudioPlaying ? 'playing' : ''} ${!hasInteractedWithAudio ? 'blink-attention' : ''}`} 
                    onClick={toggleAudio}
                    title={isAudioPlaying ? "Stop Voice" : "Play Welcome Voice"}
                >
                    {isAudioPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <line x1="23" y1="9" x2="17" y2="15"></line>
                            <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                    )}
                </button>
            </div>

            {/* Background Overlay to ensure text readability against the image */}
            <div className="dark-overlay"></div>

            {/* Background Sparkle Layers */}
            <SparkleParticles count={50} />

            <div className="content-wrapper">
                {/* Brand Header */}
                <motion.div
                    className="brand-header"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <h2 className="brand-title">MadigaMitra</h2>
                    <p className="brand-subtitle">MATRIMONY</p>
                </motion.div>

                {/* Center Content Typography */}
                <div className="landing-content">
                    <motion.h1
                        className="main-heading"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    >
                        Let Love Take Flight
                    </motion.h1>
                    <motion.p
                        className="main-subheading"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    >
                        Connecting MADIGA Soulmates Across the World
                    </motion.p>
                </div>

                {/* Action Button Container */}
                <motion.div
                    className="btn-explore-container"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                >
                    <button className="btn-explore" onClick={handleExplore}>
                        <svg className="heart-bg" viewBox="0 0 24 24" fill="url(#btn-gradient)" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="btn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(147, 51, 234, 0.8)" />
                                    <stop offset="50%" stopColor="rgba(126, 34, 206, 0.7)" />
                                    <stop offset="100%" stopColor="rgba(88, 28, 135, 0.6)" />
                                </linearGradient>
                            </defs>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="btn-text">Explore</span>
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
                            y: [0, -6, 0]
                        }}
                        transition={isTransitioning
                            ? { duration: 2, ease: "easeInOut" }
                            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                        }
                    >
                        <svg
                            width="60"
                            height="60"
                            viewBox="0 0 100 100"
                            fill="url(#img-realistic-gradient)"
                            className="butterfly-wings butterfly-svg"
                        >
                            <defs>
                                <linearGradient id="img-realistic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#d8b4fe" />
                                    <stop offset="50%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#7e22ce" />
                                </linearGradient>
                            </defs>
                            <path d="M50 45 C 35 15, 10 10, 15 45 C 18 55, 30 75, 45 60 C 48 56, 50 50, 50 50 L 50 50 C 50 50, 52 56, 55 60 C 70 75, 82 55, 85 45 C 90 10, 65 15, 50 45 Z" />
                            <path d="M48 30 C 49 15, 51 15, 52 30 C 53 45, 51 65, 50 65 C 49 65, 47 45, 48 30 Z" fill="#3b0764" />
                        </svg>
                    </motion.div>

                    {/* Trail emitted on click */}
                    <div style={{ position: 'absolute', top: -5, right: 15, pointerEvents: 'none' }}>
                        <ButterflyTail isFlying={isTransitioning} isMobile={isMobile} />
                    </div>
                </motion.div>
            </div>

            {/* Discreet Admin Access Link */}
            <div
                onClick={() => navigate('/admin/login')}
                className="admin-login-trigger"
            >
                A
            </div>
        </motion.div>
    );
};

export default Landing;

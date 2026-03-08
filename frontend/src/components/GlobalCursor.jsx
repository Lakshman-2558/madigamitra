import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GlobalCursor.css';

const GlobalCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [trails, setTrails] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);

            // Generate a sparkle trail particle
            if (Math.random() > 0.5) {
                const id = Date.now() + Math.random();
                setTrails((prev) => [
                    ...prev.slice(-15), // keep up to 15 particles
                    { id, x: e.clientX, y: e.clientY, size: Math.random() * 8 + 4 }
                ]);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    // Remove particles gradually
    useEffect(() => {
        const interval = setInterval(() => {
            setTrails((prev) => prev.slice(1));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        return null; // Don't show custom cursor on mobile touch screens
    }

    return (
        <div className={`cursor-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
            {/* Main Cursor Dot */}
            <motion.div
                className="custom-cursor-dot"
                animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
                transition={{ type: "tween", ease: "backOut", duration: 0 }}
            />
            {/* Trailing Ring */}
            <motion.div
                className="custom-cursor-ring"
                animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
            />

            {/* Sparkle Trail */}
            <AnimatePresence>
                {trails.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="cursor-sparkle"
                        initial={{ opacity: 0.8, scale: 1, x: particle.x, y: particle.y }}
                        animate={{ opacity: 0, scale: 0, y: particle.y + 20 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            width: particle.size,
                            height: particle.size,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GlobalCursor;

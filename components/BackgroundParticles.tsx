'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';

interface BackgroundParticlesProps {
    themeColor: string;
}

export default function BackgroundParticles({ themeColor }: BackgroundParticlesProps) {
    // Generate random particles - reduced count on mobile
    const getParticleCount = () => {
        if (typeof window === 'undefined') return 12;
        return window.innerWidth < 768 ? 6 : 12;
    };

    const particleCount = getParticleCount();
    const [particles, setParticles] = useState<{
        id: number;
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    }[]>([]);
    
    const particlesRef = useRef(false);

    useEffect(() => {
        if (particlesRef.current) return;
        particlesRef.current = true;
        
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            size: Math.random() * 8 + 4, // px - reduced size
            duration: Math.random() * 12 + 15, // seconds - longer duration = fewer repaints
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full opacity-20 blur-sm"
                    style={{
                        backgroundColor: themeColor,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        willChange: 'transform',
                    }}
                    animate={{
                        y: [0, -80, 0],
                        x: [0, Math.random() * 30 - 15, 0],
                        opacity: [0.1, 0.25, 0.1],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: p.delay,
                    }}
                />
            ))}
            {/* Ambient Glows - CSS animation instead of Framer Motion */}
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-15 pointer-events-none"
                style={{ 
                    backgroundColor: themeColor,
                    animation: 'glow 8s ease-in-out infinite',
                }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none"
                style={{ 
                    backgroundColor: themeColor,
                    animation: 'glow 10s ease-in-out infinite 2s',
                }}
            />
        </div>
    );
}

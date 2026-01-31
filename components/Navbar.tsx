'use client';

import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

// Throttle utility
const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

export default function Navbar({ hidden = false }: { hidden?: boolean }) {
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const [isCompact, setIsCompact] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const previousScroll = useRef(0);

    useEffect(() => {
        const handleScroll = throttle((latest: number) => {
            const previous = previousScroll.current;
            const direction = latest > previous ? 'down' : 'up';
            previousScroll.current = latest;

            setIsAtTop(latest <= 50);

            if (latest > 50 && direction === 'down') {
                setIsCompact(true);
            } else if (direction === 'up') {
                setIsCompact(false);
            }
        }, 50); // Throttle to 50ms

        return scrollY.on('change', handleScroll as any);
    }, [scrollY]);

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                layout
                className={`fixed z-50 flex items-center transition-all duration-500 ease-[0.25,0.1,0.25,1.0] ${isCompact
                    ? 'top-6 left-4 md:left-8 right-auto pointer-events-none'
                    : 'top-6 left-0 right-0 justify-center w-full pointer-events-none'
                    }`}
                initial={false}
                transition={{
                    type: "tween",
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0]
                }}
            >
                <motion.div
                    layout
                    className={`relative flex items-center pointer-events-auto overflow-hidden ${isCompact
                        ? 'bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl rounded-full px-2 py-2 gap-0'
                        : `w-[95%] md:w-full max-w-7xl rounded-full px-6 h-16 gap-8 justify-between ${isAtTop ? 'bg-transparent' : 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg'
                        }`
                        }`}
                    transition={{
                        type: "tween",
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                >
                    {/* Logo - Always Visible */}
                    <motion.div layout="position" className="z-10 flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                            onClick={handleLogoClick}
                        >
                            <div className="w-12 h-12 relative animate-bounce-slow">
                                <Image
                                    src="/logo.webp"
                                    alt="Logo"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain drop-shadow-md"
                                    priority
                                />
                            </div>
                            <AnimatePresence mode="popLayout">
                                {!isCompact && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="hidden md:flex items-center gap-2 ml-2 font-titan select-none"
                                    >
                                        <div className="flex items-center">
                                            {['C', 'A', 'N', 'Z', 'Z', 'Y'].map((char, i) => {
                                                const colors = [
                                                    'text-[#FF6B6B]', // C - Red/Orange
                                                    'text-[#FFD93D]', // A - Yellow
                                                    'text-[#FF8B3D]', // N - Orange
                                                    'text-[#FFD93D]', // Z - Yellow
                                                    'text-[#6BCB77]', // Z - Green
                                                    'text-[#FF4D94]'  // Y - Pink
                                                ];
                                                return (
                                                    <span
                                                        key={i}
                                                        className={`${colors[i]} text-4xl tracking-wide drop-shadow-[2px_2px_0_rgba(69,25,12,1)] transform hover:scale-110 transition-transform duration-300`}
                                                        style={{
                                                            WebkitTextStroke: '1.5px #45190C',
                                                            textShadow: '2px 2px 0 #45190C'
                                                        }}
                                                    >
                                                        {char}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Link>
                    </motion.div>

                    {/* Desktop Links - Hidden when compact */}
                    <AnimatePresence>
                        {!isCompact && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="hidden md:flex items-center gap-2 overflow-hidden whitespace-nowrap"
                            >
                                {['Our Story', 'Flavors', 'Contact'].map((item) => (
                                    <Link
                                        key={item}
                                        href={item === 'Flavors' ? '/flavors' : item === 'Our Story' ? '/our-story' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="relative px-4 py-2 rounded-full text-gray-700 dark:text-white/80 text-sm font-medium tracking-wide uppercase transition-all hover:text-black dark:hover:text-white overflow-hidden group"
                                    >
                                        <span className="relative z-10">{item}</span>
                                        <span className="absolute inset-0 bg-lime-400/20 dark:bg-lime-400/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full origin-center" />
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions - Hidden when compact */}
                    <AnimatePresence>
                        {!isCompact && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex items-center gap-4 overflow-hidden"
                            >
                                <div className="hidden md:block">
                                    <ThemeToggle />
                                </div>
                                <a
                                    href="https://wa.me/919354502422"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden md:flex items-center gap-2 bg-lime-500 text-black px-6 py-2 rounded-full font-bold transition-all hover:brightness-110 relative overflow-hidden group"
                                >
                                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative flex items-center gap-2">
                                        <span>WhatsApp</span>
                                        <MessageCircle size={18} />
                                    </span>
                                </a>
                                <div className="md:hidden ml-auto">
                                    <button
                                        className="text-gray-900 dark:text-white"
                                        onClick={() => setMobileMenuOpen(true)}
                                    >
                                        <Menu />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col p-6"
                    >
                        <button
                            className="self-end text-white p-2 mb-8"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>

                        <div className="flex flex-col gap-8 items-center justify-center flex-grow">
                            {['Our Story', 'Flavors', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Flavors' ? '/flavors' : item === 'Our Story' ? '/our-story' : `/${item.toLowerCase().replace(' ', '-')}`}
                                    className="text-3xl text-white font-bold tracking-tight hover:text-lime-400 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <div className="mt-8 flex items-center gap-4 text-white">
                                <span className="opacity-60">Theme</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

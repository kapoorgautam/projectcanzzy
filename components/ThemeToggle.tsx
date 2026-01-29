'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div
            onClick={toggleTheme}
            className={`
                relative w-24 h-11 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-500 shadow-inner
                ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-gray-100 border border-gray-300'}
            `}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle Theme"
        >
            {/* Text Layers */}
            <AnimatePresence initial={false}>
                {!isDark && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-3 text-xs font-bold font-sans text-gray-600 uppercase tracking-widest pointer-events-none"
                    >
                        Light
                    </motion.span>
                )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
                {isDark && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-3 text-xs font-bold font-sans text-white uppercase tracking-widest pointer-events-none"
                    >
                        Dark
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Sliding Knob */}
            <motion.div
                className={`
                    w-9 h-9 rounded-full shadow-md flex items-center justify-center relative z-10
                    ${isDark ? 'bg-white text-slate-900' : 'bg-white text-gray-900 border border-gray-200'}
                `}
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                animate={{
                    x: isDark ? 0 : 52 // 24 * 4px = 96px width -> math: 96 - 4 - 36 ~= 56ish. tuned to 52.
                }}
            >
                <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ scale: 0.5, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDark ? (
                        <Sun size={18} fill="currentColor" className="text-orange-500" />
                    ) : (
                        <Moon size={18} fill="currentColor" className="text-indigo-500" />
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

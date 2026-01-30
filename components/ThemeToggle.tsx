'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-300"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {isDark ? (
                    <Sun size={20} className="text-yellow-400" fill="currentColor" />
                ) : (
                    <Moon size={20} className="text-slate-700" fill="currentColor" />
                )}
            </motion.div>
        </button>
    );
}

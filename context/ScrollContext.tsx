'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useScroll } from 'framer-motion';

interface ScrollContextType {
    scrollY: any;
    scrollYProgress: any;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: ReactNode }) {
    const { scrollY, scrollYProgress } = useScroll();

    return (
        <ScrollContext.Provider value={{ scrollY, scrollYProgress }}>
            {children}
        </ScrollContext.Provider>
    );
}

export function useGlobalScroll() {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useGlobalScroll must be used within ScrollProvider');
    }
    return context;
}

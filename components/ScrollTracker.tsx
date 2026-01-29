'use client';

import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useRef } from 'react';

interface ScrollTrackerProps {
    onVisibilityChange: (visible: boolean) => void;
}

export default function ScrollTracker({ onVisibilityChange }: ScrollTrackerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Active when the section is significantly on screen
        // 500vh container, so 0.05 is safe threshold
        const isVisible = latest > 0.05 && latest < 0.95;
        onVisibilityChange(isVisible);
    });

    // Reset on mount
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Just to ensure listener attaches
    });

    return (
        <div ref={ref} className="absolute inset-0 pointer-events-none" />
    );
}

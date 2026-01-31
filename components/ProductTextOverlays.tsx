'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { Product } from '@/data/products';

interface ProductTextOverlaysProps {
    product: Product;
}

export default function ProductTextOverlays({ product }: ProductTextOverlaysProps) {
    // Use the same scrolling container assumption (parent is handling the height)
    // Actually, to sync perfectly, we should probably pass the scroll progress or ref from the parent?
    // Or simpler: This component *also* creates a 500vh container that sits on top (pointer-events-none) 
    // to track the same scroll positions.

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const Section = ({
        title,
        subtitle,
        extraText,
        start,
        end,
        align = 'center'
    }: {
        title: string;
        subtitle: string;
        extraText?: string;
        start: number;
        end: number;
        align?: 'left' | 'center' | 'right';
    }) => {
        const opacity = useTransform(
            scrollYProgress,
            [start, start + 0.05, end - 0.05, end],
            [0, 1, 1, 0]
        );
        const y = useTransform(
            scrollYProgress,
            [start, start + 0.05, end - 0.05, end],
            [50, 0, 0, -50]
        );

        const alignmentClasses = {
            left: 'items-start text-left pl-10 md:pl-32',
            center: 'items-center text-center',
            right: 'items-end text-right pr-10 md:pr-32',
        };

        return (
            <motion.div
                style={{ opacity, y }}
                className={`fixed inset-0 flex flex-col justify-center pointer-events-none ${alignmentClasses[align]} z-10 px-4`}
                initial={false}
            >
                <div className="flex flex-col items-center md:items-start w-full">
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-gray-900 dark:text-white drop-shadow-2xl mb-2 md:mb-4 transition-colors duration-500 text-center md:text-left w-full will-change-transform">
                        {title}
                    </h2>
                    <p className="text-lg md:text-3xl text-lime-600 dark:text-lime-400 font-bold max-w-lg drop-shadow-lg mb-4 md:mb-6 transition-colors duration-500 text-center md:text-left w-full">
                        {subtitle}
                    </p>
                    {extraText && (
                        <h3 className="text-3xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-center w-full mb-8 md:mb-0">
                            {extraText}
                        </h3>
                    )}

                    {/* Data Badge for Mobile Filling */}
                    {!extraText && (
                        <div className="md:hidden mt-4 bg-white/20 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200">
                                100% Authentic Taste
                            </span>
                        </div>
                    )}
                </div>

                {/* Scroll Indicator for First Section Only */}
                {start === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 10 }}
                        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center md:hidden"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Scroll</span>
                        <div className="w-1 h-12 bg-gradient-to-b from-lime-500 to-transparent rounded-full" />
                    </motion.div>
                )}
            </motion.div>
        );
    };

    return (
        <div ref={containerRef} className="absolute inset-0 h-[500vh] w-full pointer-events-none">
            <Section
                title={product.name}
                subtitle={product.subName}
                extraText={product.heroHeadline} // Pass the hero headline
                start={0}
                end={0.15}
                align="center"
            />
            <Section
                title={product.section1.title}
                subtitle={product.section1.subtitle}
                start={0.15}
                end={0.35}
                align="center"
            />
            <Section
                title={product.section2.title}
                subtitle={product.section2.subtitle}
                start={0.3}
                end={0.5}
                align="left"
            />
            <Section
                title={product.section3.title}
                subtitle={product.section3.subtitle}
                start={0.55}
                end={0.75}
                align="right"
            />
            <Section
                title={product.section4.title}
                subtitle={product.section4.subtitle}
                start={0.8}
                end={0.95}
                align="center"
            />
        </div>
    );
}

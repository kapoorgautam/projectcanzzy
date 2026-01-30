'use client';

import { useScroll } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Product } from '@/data/products';
import BackgroundParticles from './BackgroundParticles';
import NextImage from 'next/image';


interface ProductCandyScrollProps {
    product: Product;
}

export default function ProductCandyScroll({ product }: ProductCandyScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameCount = product.frameCount;
    const [currentFrame, setCurrentFrame] = useState(product.startFrame || 1);


    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80px', 'end end'],
    });

    const startFrameIndex = (product.startFrame || 1);
    const endFrameIndex = frameCount;

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            // Calculate frame index based on scroll progress
            const frame = Math.floor(startFrameIndex + latest * (endFrameIndex - startFrameIndex));

            // Clamp value to safe bounds
            const safeFrame = Math.max(startFrameIndex, Math.min(endFrameIndex, frame));

            setCurrentFrame(safeFrame);
        });

        return () => unsubscribe();
    }, [scrollYProgress, startFrameIndex, endFrameIndex]);


    // Background prefetch for smoother animation
    useEffect(() => {
        let isMounted = true;
        const preloadImages = async () => {
            // Priority: Load every 5th frame first for fast scrolling context
            for (let i = 1; i <= frameCount; i += 5) {
                if (!isMounted) return;
                const img = new window.Image();
                img.src = `${product.folderPath}/${i}.jpg`;
            }
            // Then fill in the gaps
            for (let i = 1; i <= frameCount; i++) {
                if (i % 5 === 0) continue; // Skip already loaded
                if (!isMounted) return;
                const img = new window.Image();
                img.src = `${product.folderPath}/${i}.jpg`;
            }
        };

        // Start preloading after a short delay to allow critical rendering
        const timer = setTimeout(() => {
            preloadImages();
        }, 100);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [product.folderPath, frameCount]);

    return (
        <div ref={containerRef} className="h-[500vh] relative">
            <div className="sticky top-[0px] h-screen w-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
                <div className={`absolute inset-0 opacity-100 bg-gradient-to-br ${product.gradient}`} />
                <div className="absolute inset-0 bg-black/20" />

                <BackgroundParticles themeColor={product.themeColor} />

                <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] z-10 flex items-center justify-center">
                    <NextImage
                        src={`${product.folderPath}/${currentFrame}.jpg`}
                        alt={`${product.name} frame ${currentFrame}`}
                        fill
                        priority
                        unoptimized // Bypass server optimization for static assets to reduce latency
                        loading="eager"
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 100vw"
                        quality={85}
                    />
                </div>
            </div>
        </div>
    );
}

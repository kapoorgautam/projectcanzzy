'use client';

import { useScroll } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Product } from '@/data/products';
import BackgroundParticles from './BackgroundParticles';


interface ProductCandyScrollProps {
    product: Product;
}

export default function ProductCandyScroll({ product }: ProductCandyScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameCount = product.frameCount;
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const startFrameIndex = (product.startFrame || 1);
    const endFrameIndex = frameCount;

    // Helper to draw image with object-fit: cover
    const drawImage = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
        const canvas = ctx.canvas;
        const w = canvas.width;
        const h = canvas.height;
        const iw = img.width;
        const ih = img.height;

        const r = Math.min(w / iw, h / ih);
        let nw = iw * r;   // new prop. width
        let nh = ih * r;   // new prop. height
        let cx, cy, cw, ch, ar = 1;

        // decide which gap to fill    
        if (nw < w) ar = w / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
        nw *= ar;
        nh *= ar;

        // calc source rectangle
        cw = iw / (nw / w);
        ch = ih / (nh / h);

        cx = (iw - cw) * 0.5;
        cy = (ih - ch) * 0.5;

        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
    }, []);

    const renderFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Find the image for this frame
        // Our images array is 0-indexed, but frames are 1-indexed (usually)
        // Adjust logic based on how we store them
        const img = images[index - 1]; // Assuming images are loaded sequentially corresponding to frame 1 to N

        if (img && img.complete) {
            // Set canvas size to match display size (for sharpness)
            // But usually we want to keep it consistent. 
            // Better to set internal resolution once or on resize.
            // For now, let's just make sure it matches client size
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            drawImage(ctx, img);
        }
    }, [images, drawImage]);

    // Preload images
    useEffect(() => {
        let isMounted = true;
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 1; i <= frameCount; i++) {
                const p = new Promise<void>((resolve) => {
                    const img = new window.Image();
                    img.src = `${product.folderPath}/${i}.jpg`;
                    img.onload = () => resolve();
                    // Keep order correct in array
                    loadedImages[i - 1] = img;
                });
                promises.push(p);
            }

            await Promise.all(promises);

            if (isMounted) {
                setImages(loadedImages);
                setIsLoaded(true);
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, [product.folderPath, frameCount]);


    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            // Re-render current frame if needed, but the scroll listener will likely trigger updates too
            // Just ensuring canvas size is correct
            if (canvasRef.current) {
                canvasRef.current.width = canvasRef.current.clientWidth;
                canvasRef.current.height = canvasRef.current.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Sync with scroll
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;

        // Draw initial frame
        renderFrame(startFrameIndex);

        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const frame = Math.floor(startFrameIndex + latest * (endFrameIndex - startFrameIndex));
            const safeFrame = Math.max(startFrameIndex, Math.min(endFrameIndex, frame));
            requestAnimationFrame(() => renderFrame(safeFrame));
        });

        return () => unsubscribe();
    }, [scrollYProgress, isLoaded, images, startFrameIndex, endFrameIndex, renderFrame]);

    return (
        <div ref={containerRef} className="h-[500vh] relative">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
                <div className={`absolute inset-0 opacity-100 bg-gradient-to-br ${product.gradient}`} />
                <div className="absolute inset-0 bg-black/20" />

                <BackgroundParticles themeColor={product.themeColor} />

                <div className="relative w-full h-full z-10">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

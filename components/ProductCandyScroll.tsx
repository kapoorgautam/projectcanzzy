'use client';

import { useScroll } from 'framer-motion';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Product } from '@/data/products';
import BackgroundParticles from './BackgroundParticles';


interface ProductCandyScrollProps {
    product: Product;
}

export default function ProductCandyScroll({ product }: ProductCandyScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameCount = product.frameCount;
    const imageCache = useRef<Map<number, HTMLImageElement>>(new Map());
    const loadingQueue = useRef<Set<number>>(new Set());
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Preload nearby frames (buffer for smooth scrolling)
    const PRELOAD_BUFFER = 5;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const startFrameIndex = (product.startFrame || 1);
    const endFrameIndex = frameCount;

    // Lazy load image function
    const loadImage = useCallback((frameIndex: number) => {
        if (imageCache.current.has(frameIndex) || loadingQueue.current.has(frameIndex)) {
            return;
        }

        loadingQueue.current.add(frameIndex);

        const img = new window.Image();
        img.src = `${product.folderPath}/${frameIndex}.webp`;
        img.onload = () => {
            imageCache.current.set(frameIndex, img);
            loadingQueue.current.delete(frameIndex);
        };
        img.onerror = () => {
            loadingQueue.current.delete(frameIndex);
        };
    }, [product.folderPath]);

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
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Try to get cached image
        const img = imageCache.current.get(index);

        if (img && img.complete) {
            // Set canvas size to match display size (for sharpness)
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            drawImage(ctx, img);
        } else {
            // Render placeholder or clear canvas
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Trigger loading of this frame if not already cached
        if (!imageCache.current.has(index)) {
            loadImage(index);
        }
    }, [drawImage, loadImage]);

    // Initialize with first frame and preload nearby frames
    useEffect(() => {
        loadImage(startFrameIndex);
        setIsInitialized(true);
        return () => {
            // Cleanup
            imageCache.current.clear();
            loadingQueue.current.clear();
        };
    }, [startFrameIndex, loadImage]);


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
        if (!isInitialized) return;

        // Draw initial frame
        renderFrame(startFrameIndex);

        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const frame = Math.floor(startFrameIndex + latest * (endFrameIndex - startFrameIndex));
            const safeFrame = Math.max(startFrameIndex, Math.min(endFrameIndex, frame));
            
            setCurrentFrame(safeFrame);

            // Preload nearby frames
            for (let i = -PRELOAD_BUFFER; i <= PRELOAD_BUFFER; i++) {
                const frameToLoad = safeFrame + i;
                if (frameToLoad >= startFrameIndex && frameToLoad <= endFrameIndex) {
                    loadImage(frameToLoad);
                }
            }

            requestAnimationFrame(() => renderFrame(safeFrame));
        });

        return () => unsubscribe();
    }, [scrollYProgress, isInitialized, startFrameIndex, endFrameIndex, renderFrame, loadImage]);

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

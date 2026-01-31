/**
 * Image utilities for optimized loading and format detection
 */

/**
 * Detects if WebP is supported by the browser
 */
export const supportsWebP = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
        return canvas.toDataURL('image/webp').includes('webp');
    } catch {
        return false;
    }
};

/**
 * Memoized WebP support check
 */
let webpSupport: boolean | null = null;
export const isWebPSupported = (): boolean => {
    if (webpSupport === null) {
        webpSupport = supportsWebP();
    }
    return webpSupport;
};

/**
 * Get the optimal image URL based on browser support
 * @param basePath - Base path without extension (e.g., '/images/kaccha-mango/1')
 * @returns URL with appropriate extension
 */
export const getOptimalImageUrl = (basePath: string): string => {
    if (isWebPSupported()) {
        return `${basePath}.webp`;
    }
    return `${basePath}.jpg`;
};

/**
 * Preload an image in the background without blocking
 */
export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Batch preload multiple images
 */
export const preloadImages = (urls: string[]): Promise<PromiseSettledResult<void>[]> => {
    return Promise.allSettled(urls.map(preloadImage));
};

'use client';

import Image from 'next/image';
import { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  fallback?: string;
}

/**
 * Optimized Image Component Wrapper
 * Features:
 * - Automatic WebP format selection
 * - Loading skeleton
 * - Error handling
 * - Blur-up placeholder support
 */
export default function OptimizedImage({
  alt,
  fallback = '/placeholder.svg',
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
      )}
      <Image
        {...props}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        onError={(error) => {
          setHasError(true);
          setIsLoading(false);
          onError?.(error);
        }}
        src={hasError ? fallback : props.src}
        quality={props.quality || 85}
      />
    </div>
  );
}

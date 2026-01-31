/**
 * Static Site Generation Configuration
 * This file configures static exports and ISR (Incremental Static Regeneration)
 */

// Enable SSG and ISR with dynamic route generation
export const generateStaticParams = async () => {
    // This is used for pages that need static generation
    return [];
};

// Revalidate pages every hour for ISR
export const revalidate = 3600; // 1 hour in seconds

// Use static generation when possible
export const preferredRegion = 'auto';

'use client';

import { Facebook, Instagram, Twitter, Check } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'newsletter', data: { email: newsletterEmail } }),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
                setNewsletterEmail('');
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Subscription failed. Try again.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Network error. Please help.');
        }
    };

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 py-6 md:pt-10 md:pb-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4 md:mb-6">
                            <Image 
                                src="/logo.webp" 
                                alt="CANZZY" 
                                width={48}
                                height={48}
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-sm mb-6 md:mb-8">
                            Revolutionizing the industry with authentic candies, premium mouth fresheners, and a tangy twist that keeps you coming back for more.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <Icon size={18} className="md:w-5 md:h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-4 md:mb-6">Shop</h3>
                        <ul className="space-y-2 md:space-y-4 text-sm md:text-base">
                            {[
                                { name: 'All Flavors', href: '/flavors' },
                                { name: 'Bulk Orders', href: '/contact' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-600 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors inline-block py-1 relative group">
                                        <span className="relative z-10">{item.name}</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-500 group-hover:w-full transition-all duration-300" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-4 md:mb-6">Newsletter</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs md:text-sm">Subscribe for new flavor drops and exclusive offers.</p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2 md:gap-3">
                            <input
                                type="email"
                                required
                                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                title="Please enter a valid email address"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-gray-900 dark:text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                            <button
                                disabled={status === 'submitting' || status === 'success'}
                                className={`font-bold py-2 md:py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base w-full relative overflow-hidden group ${status === 'success'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-lime-500 text-black'
                                    }`}
                            >
                                {status !== 'success' && <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                                <span className="relative flex items-center gap-2">
                                    {status === 'submitting' ? 'Subscribing...' : status === 'success' ? (
                                        <>
                                            <Check size={18} /> Subscribed
                                        </>
                                    ) : 'Subscribe'}
                                </span>
                            </button>
                            {status === 'error' && (
                                <p className="text-red-500 text-xs font-bold mt-1">{errorMessage}</p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} kapoor food products. All rights reserved.</p>
                    <div className="flex gap-4 md:gap-8">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer >
    );
}

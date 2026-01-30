'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Package, FlaskConical, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


type InquiryType = 'general' | 'bulk' | 'custom';

export default function ContactPage() {
    const [inquiryType, setInquiryType] = useState<InquiryType>('general');
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        setErrorMessage('');

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            inquiryType,
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            company: formData.get('company'),
            quantity: formData.get('quantity'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'contact', data }),
            });

            const result = await response.json();

            if (response.ok) {
                setFormStatus('success');
            } else {
                setFormStatus('error');
                setErrorMessage(result.error || 'Failed to send. Please try again.');
            }
        } catch (error) {
            setFormStatus('error');
            setErrorMessage('Failed to send. Please check your connection.');
        }
    };

    return (
        <main className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white min-h-screen transition-colors duration-500 selection:bg-lime-500 selection:text-white">
            <Navbar />


            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 to-yellow-500/10 pointer-events-none" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6"
                    >
                        Let&apos;s Talk <span className="text-lime-600 dark:text-lime-500">Candy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Whether you want to stock your shelves, customize a flavor for your event, or just say hello — we&apos;re all ears.
                    </motion.p>
                </div>
            </section>

            <section className="pb-32 px-4 mt-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0, x: -50 },
                            visible: {
                                opacity: 1,
                                x: 0,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                        className="space-y-12"
                    >
                        <div>
                            <motion.h3 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-2xl font-bold mb-8">Get in Touch</motion.h3>
                            <div className="space-y-8">
                                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-5 group">
                                    <div className="w-14 h-14 rounded-full bg-lime-100 dark:bg-lime-500/10 flex items-center justify-center text-lime-600 dark:text-lime-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Email Us</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg">gautamkapoor512@gmail.com</p>
                                    </div>
                                </motion.div>
                                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-5 group">
                                    <div className="w-14 h-14 rounded-full bg-lime-100 dark:bg-lime-500/10 flex items-center justify-center text-lime-600 dark:text-lime-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Call Us</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg">+91 9354502422</p>
                                        <p className="text-gray-500 text-sm">Mon-Fri, 9am - 6pm IST</p>
                                    </div>
                                </motion.div>
                                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-5 group">
                                    <div className="w-14 h-14 rounded-full bg-lime-100 dark:bg-lime-500/10 flex items-center justify-center text-lime-600 dark:text-lime-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Address</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg">A-26, shiv bux park nangloi,</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg">delhi-110041</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="bg-lime-500 p-8 rounded-3xl text-black relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Partner with Us</h3>
                                <p className="mb-6 font-medium">Join the revolution! Become a distributor and spread the tangy joy across your city.</p>
                                <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-black hover:text-white transition-colors">
                                    Download Brochure
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                        </div>
                    </motion.div>

                    {/* Form Section with Header */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-3xl font-black mb-4 flex items-center gap-3">
                                <span className="w-12 h-1 bg-lime-500 rounded-full inline-block"></span>
                                Send us a Message
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Got an idea? A question? Or just want to say hi? <br className="hidden md:block" />
                                Drop your message and we'll get back to you!
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none"
                        >
                            {formStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xs">
                                        We&apos;ll get back to you within 24 hours. Stay tangy!
                                    </p>
                                    <button
                                        onClick={() => setFormStatus('idle')}
                                        className="text-lime-600 dark:text-lime-400 font-bold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Inquiry Type Toggle */}
                                    <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-black/50 rounded-xl mb-8">
                                        <button
                                            type="button"
                                            onClick={() => setInquiryType('general')}
                                            className={`py-2 px-4 rounded-lg text-sm font-bold transition-all w-full relative overflow-hidden group ${inquiryType === 'general' ? 'bg-white dark:bg-gray-800 shadow text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'}`}
                                        >
                                            General
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInquiryType('bulk')}
                                            className={`py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 w-full relative overflow-hidden group ${inquiryType === 'bulk' ? 'bg-white dark:bg-gray-800 shadow text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'}`}
                                        >
                                            <Package size={14} /> Bulk
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInquiryType('custom')}
                                            className={`py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 w-full relative overflow-hidden group ${inquiryType === 'custom' ? 'bg-white dark:bg-gray-800 shadow text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'}`}
                                        >
                                            <FlaskConical size={14} /> Custom
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-500 transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
                                            <input
                                                name="phone"
                                                type="tel"
                                                required
                                                pattern="^[0-9]{10}$"
                                                title="Please enter a valid 10-digit phone number"
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-500 transition-colors"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                                title="Please enter a valid email address"
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-500 transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {(inquiryType === 'bulk' || inquiryType === 'custom') && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Company Name</label>
                                                <input
                                                    name="company"
                                                    type="text"
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-500 transition-colors"
                                                    placeholder="Your Business"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Estimated Quantity</label>
                                                <select name="quantity" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-500 transition-colors">
                                                    <option>100 - 500 units</option>
                                                    <option>500 - 2000 units</option>
                                                    <option>2000+ units</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {inquiryType === 'custom' && (
                                        <div className="p-4 bg-lime-50 dark:bg-lime-900/10 rounded-xl border border-lime-200 dark:border-lime-500/20">
                                            <h5 className="font-bold text-lime-700 dark:text-lime-400 mb-2 flex items-center gap-2">
                                                <FlaskConical size={16} /> Flavor Lab
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Describe the flavor profile you&apos;re looking for (e.g., &quot;Spicy Guava&quot; or &quot;Sweet Tamarind&quot;). Our chefs will work with you to create a prototype.
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Message</label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            required
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-500 transition-colors"
                                            placeholder="Tell us what you need..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full bg-lime-500 text-black font-bold py-4 rounded-xl text-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <span className="relative flex items-center gap-2">
                                            {formStatus === 'submitting' ? (
                                                'Sending...'
                                            ) : (
                                                <>
                                                    <Send size={20} /> Send Message
                                                </>
                                            )}
                                        </span>
                                    </button>

                                    {formStatus === 'error' && (
                                        <div className="flex items-center gap-2 justify-center text-red-500">
                                            <AlertCircle size={18} />
                                            <p className="text-sm font-bold">{errorMessage}</p>
                                        </div>
                                    )}
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="w-full h-32 bg-gradient-to-t from-lime-500/10 to-transparent pointer-events-none -mt-32 relative z-0" />

            <Footer />
        </main>
    );
}

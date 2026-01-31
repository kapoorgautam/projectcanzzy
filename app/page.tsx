'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Leaf, Truck, RotateCcw, Box, Users, Factory, Globe, ShieldCheck, FileText, Phone, MessageCircle, Package, Award, TrendingUp, Ship, Candy, IceCream, Smile, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import ScrollTracker from '@/components/ScrollTracker';

const ProductCandyScroll = dynamic(() => import('@/components/ProductCandyScroll'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-gray-100 dark:bg-gray-900 animate-pulse" />
});
import ProductTextOverlays from '@/components/ProductTextOverlays';




const SeamlessExportSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "center center"]
  });

  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    { title: "Pick Your Flavor", icon: Candy },
    { title: "Taste The Samples", icon: Smile },
    { title: "Safe Ingredients", icon: Leaf },
    { title: "Fresh Delivery", icon: Truck },
    { title: "Happy Customers", icon: Heart }
  ];

  return (
    <section ref={ref} className="py-12 md:py-24 bg-white dark:bg-black relative z-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900 dark:text-white">Freshness From Factory to You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 relative">
          {/* Background Line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gray-100 dark:bg-white/10 -z-10">
            <motion.div
              style={{ width }}
              className="h-full bg-lime-500"
            />
          </div>

          {steps.map((step, i) => (
            <StepItem key={i} step={step} index={i} total={steps.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepItem = ({ step, index, total, progress }: { step: any, index: number, total: number, progress: any }) => {
  // Calculate triggers based on index. Equal segments.
  // 5 steps. 0 starts at 0, 1 at 0.2, etc.
  const segment = 1 / total;
  const start = index * segment;
  const end = start + (segment * 0.5); // Fast transition

  const borderColor = useTransform(progress, [start, end], ["rgba(243, 244, 246, 1)", "rgba(132, 204, 22, 1)"]);
  const iconColor = useTransform(progress, [start, end], ["rgba(156, 163, 175, 1)", "rgba(132, 204, 22, 1)"]);

  // Need separate logical transform for dark mode borders? 
  // Simplified to standard gray-200. Dark mode border might need adjustment if it was significantly different.
  // Original: border-gray-100 (light) / white/10 (dark).
  // I will just use colors that look good in general or simple hex.
  // Let's use logic for dark mode awareness if possible, but useTransform creates inline styles which override classes.
  // Safest is to use hex codes. border-gray-100 is #f3f4f6. border-white/10 is rgba(255,255,255,0.1).
  // It's hard to do conditional dark mode easily in useTransform without context or a lot of work. 
  // I will assume light mode base for now or just picked a safe neutral gray.

  return (
    <div className="flex flex-col items-center text-center p-2">
      <motion.div
        style={{ borderColor, color: iconColor }}
        className="w-16 h-16 sm:w-24 sm:h-24 bg-white dark:bg-zinc-900 border-4 rounded-full flex items-center justify-center mb-3 sm:mb-6 z-10 transition-colors"
      >
        <step.icon size={24} className="sm:w-8 sm:h-8" />
      </motion.div>
      <h4 className="font-bold text-sm sm:text-lg text-gray-900 dark:text-white leading-tight">{step.title}</h4>
    </div>
  );
}


function HomeContent() {
  const searchParams = useSearchParams();
  const initialIndex = searchParams.get('product_index') ? parseInt(searchParams.get('product_index')!) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isCanvasActive, setIsCanvasActive] = useState(false);
  const product = products[currentIndex];


  useEffect(() => {
    if (searchParams.get('product_index')) {
      setCurrentIndex(parseInt(searchParams.get('product_index')!));
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [currentIndex]);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <main className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white selection:bg-lime-500 selection:text-white transition-colors duration-500">
      {/* Hide navbar when canvas is active */}
      <Navbar hidden={isCanvasActive} />

      {/* Navigation Controls - Conditionally Visible */}
      <AnimatePresence>
        {isCanvasActive && (
          <motion.div
            initial={{ y: 100, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 100, opacity: 0, x: "-50%" }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="fixed bottom-6 left-1/2 z-50 flex gap-2 sm:gap-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl p-2 rounded-full border border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-500 w-[95%] sm:w-auto max-w-2xl overflow-x-auto justify-start sm:justify-center no-scrollbar"
          >
            {products.map((p, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    backgroundColor: isActive ? p.themeColor : 'transparent',
                    color: isActive ? (['chandan-mukhavas', 'kaccha-mango', 'orange-blast', 'mix-fruit'].includes(p.id) ? 'white' : 'black') : '',
                  }}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 relative overflow-hidden group ${isActive
                    ? 'shadow-lg scale-100'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                >
                  {!isActive && (
                    <span className="absolute inset-0 bg-gray-100 dark:bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
                  )}
                  <span className="relative z-10">{p.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>




      {/* Brand Hero Section */}
      <section className="min-h-screen py-24 sm:py-0 flex flex-col items-center justify-center p-4 relative z-10 bg-white dark:bg-black overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-lime-400/20 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-yellow-400/20 rounded-full blur-[80px] sm:blur-[100px] animate-pulse delay-1000" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 font-bold uppercase tracking-wider text-xs sm:text-sm mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-lime-500 animate-ping" />
              Premium Indian Confectionery
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 leading-tight tracking-tight text-gray-900 dark:text-white"
          >
            Taste the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-yellow-500">Tangy Revolution</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-2"
          >
            Authentic Indian flavors crafted for the modern palate. Experience the nostalgia, modernized.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/flavors"
              className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-base sm:text-lg transition-all shadow-2xl flex items-center justify-center gap-3 mx-auto inline-flex relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                Explore Flavors
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative"
        >
          {/* Hero / Scrollytelling Section */}
          <div className="relative">
            <ScrollTracker onVisibilityChange={setIsCanvasActive} />

            {/* Gradient Background tied to product theme */}
            <div className={`absolute inset-0 bg-gradient-to-b ${product.gradient} pointer-events-none sticky top-0`} />

            <div className="relative">
              <ProductCandyScroll product={product} />
              <ProductTextOverlays product={product} />
            </div>
          </div>

          {/* SECTION 3: WHO WE SERVE */}
          {/* Mobile padding: py-12, Desktop: py-20 */}
          <section className="py-12 md:py-20 px-4 bg-white dark:bg-black relative z-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Card 1: B2B */}
              <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 p-6 sm:p-10 rounded-3xl hover:shadow-xl transition-shadow flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                  <Factory size={28} className="sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">B2B & Bulk Buyers</h3>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" /> Bulk Supply at Scale</li>
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" /> Private Label Solutions</li>
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" /> OEM Manufacturing</li>
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" /> Export-Ready Packaging</li>
                </ul>
                <a href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline text-lg py-2 group">
                  <span className="group-hover:text-blue-500 transition-colors">Request Bulk Quote</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Card 2: Retail */}
              <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 p-6 sm:p-10 rounded-3xl hover:shadow-xl transition-shadow flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 rounded-2xl flex items-center justify-center mb-6">
                  <Users size={28} className="sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Retail & End Consumers</h3>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-lime-500 rounded-full shrink-0" /> Premium Quality Ingredients</li>
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-lime-500 rounded-full shrink-0" /> Consistent Taste & Hygiene</li>
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-lime-500 rounded-full shrink-0" /> Trusted Indian FMCG Brand</li>
                  <li className="flex items-center gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-lime-500 rounded-full shrink-0" /> Fresh & Safe Products</li>
                </ul>
                {/* Since we removed individual product switching here, this could link to a catalog page or anchor to the canvas */}
                <Link href="/flavors" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-lime-600 dark:text-lime-400 font-bold hover:underline text-lg py-2 group">
                  <span className="group-hover:text-lime-500 transition-colors">Explore Products</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 4: WHY CANZZY */}
          <section className="py-12 md:py-24 bg-gray-50 dark:bg-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-10 md:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">Why Sweet Lovers Choose CANZZY</h2>
                <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400">Spreading smiles with every tangy bite.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {[
                  { icon: Globe, title: "Global Flavor Love", desc: "Enjoyed in USA, UK, UAE & Africa." },
                  { icon: ShieldCheck, title: "Pure Ingredients", desc: "FSSAI, ISO & HACCP certified safety." },
                  { icon: Candy, title: "Custom Packaging", desc: "Eye-catching packs for every shelf." },
                  { icon: Star, title: "Unbeatable Taste", desc: "Perfect balance of sweet and tangy." },
                  { icon: Factory, title: "Direct From Factory", desc: "Authentic taste from our Indian kitchen." },
                  { icon: Truck, title: "Fresh Delivery", desc: "Quick dispatch to keep flavors intact." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 bg-white dark:bg-black/50 md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-black rounded-full shadow-sm flex items-center justify-center text-lime-600 dark:text-lime-500 mb-4 sm:mb-6">
                      <item.icon size={24} className="sm:w-8 sm:h-8" />
                    </div>
                    <h4 className="text-sm sm:text-xl font-bold mb-2 text-gray-900 dark:text-white leading-tight">{item.title}</h4>
                    <p className="text-xs sm:text-base text-gray-500 dark:text-gray-400 hidden sm:block">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: PRODUCT CATEGORIES */}
          <section className="py-12 md:py-24 bg-white dark:bg-black relative z-20">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900 dark:text-white">Our Sweet Range</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { name: "Tangy Candies", color: "bg-pink-100 dark:bg-pink-900/20", text: "text-pink-700 dark:text-pink-400", link: "/flavors", icon: Candy, image: "/productimage/mixfruit.png", status: "active" },
                  { name: "Mouth Fresheners", color: "bg-emerald-100 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", link: "/flavors", icon: Leaf, image: "/productimage/chandan.png", status: "active" },
                  { name: "Fun Snacks", color: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", link: "/exports/snacks", icon: IceCream, status: "coming_soon" },
                  { name: "Gift Packs", color: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", link: "/contact", icon: Box, status: "coming_soon" }
                ].map((cat, i) => (
                  <Link
                    href={cat.status === 'active' ? cat.link : '#'}
                    key={i}
                    className={`relative p-3 sm:p-4 rounded-2xl ${cat.color} ${cat.status === 'active' ? 'hover:scale-105 cursor-pointer' : 'cursor-default'} transition-all duration-300 group flex flex-col items-center text-center overflow-hidden h-full`}
                    onClick={(e) => cat.status !== 'active' && e.preventDefault()}
                  >
                    {/* Coming Soon Badge */}
                    {cat.status === 'coming_soon' && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                          SOON
                        </span>
                      </div>
                    )}

                    <div className="h-32 w-full flex items-center justify-center mb-4 relative">
                      {cat.status === 'active' && cat.image ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                          />
                        </div>
                      ) : (
                        <motion.div
                          animate={{
                            y: [0, -5, 0],
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <cat.icon size={48} className={`${cat.text} opacity-50`} />
                        </motion.div>
                      )}
                    </div>

                    <h3 className={`text-lg sm:text-xl font-bold ${cat.text} mb-2 leading-tight`}>{cat.name}</h3>

                    {cat.status === 'active' ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${cat.text} opacity-80 mt-auto group-hover:gap-2 transition-all`}>
                        View Products <ArrowRight size={14} />
                      </span>
                    ) : (
                      <span className={`text-xs font-bold ${cat.text} opacity-60 mt-auto`}>
                        Launching Soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: EXPORT & QUALITY TRUST */}
          <section className="py-12 md:py-24 bg-gray-50 dark:bg-zinc-900 relative z-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 rounded-full font-bold text-xs sm:text-sm mb-6">
                <Award size={16} /> World-Class Standards
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Export-Grade Quality You Can Trust</h2>
              <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 md:mb-12">
                Every CANZZY product is manufactured under strict quality standards and export compliance to ensure safety, shelf life, and global acceptance.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {['FSSAI', 'ISO 22000', 'HACCP', 'HALAL', 'FDA Registered'].map((badge) => (
                  <div key={badge} className="px-4 py-2 sm:px-6 sm:py-3 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-white/10 font-bold text-sm sm:text-base text-gray-600 dark:text-gray-300 shadow-sm">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: PRIVATE LABEL (B2B MONEY SECTION) */}
          <section className="py-12 md:py-24 bg-lime-600 text-white relative z-20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">Create Your Own Candy Brand</h2>
                <p className="text-xl mb-6 opacity-90">We make it, you brand it. The tastiest partnership you'll ever have.</p>
                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {[
                    "Custom flavor development",
                    "Fun & colorful packaging",
                    "Bulk supply for events/stores",
                    "Export-ready certified products"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-lg sm:text-xl font-medium">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Award size={18} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="/contact" className="w-full sm:w-auto inline-block text-center px-10 py-5 bg-white text-lime-900 font-bold text-lg sm:text-xl rounded-full transition-all shadow-xl relative overflow-hidden group">
                  <span className="absolute inset-0 bg-lime-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">Start Private Label Inquiry</span>
                </a>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                      <Package size={40} className="text-lime-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">CANZZY</h4>
                      <p className="text-white/80">Premium Indian Confectionery</p>
                    </div>
                  </div>
                  <div className="h-4 bg-white/20 rounded-full w-3/4 mb-4" />
                  <div className="h-4 bg-white/20 rounded-full w-1/2" />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: SIMPLE EXPORT PROCESS */}
          <SeamlessExportSection />

          {/* SECTION 9: FINAL CTA */}
          <section className="py-12 md:py-24 bg-gray-900 text-white text-center px-4 relative z-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">Ready to Sweeten the Deal?</h2>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 sm:mb-10">Partner with India's most innovative candy maker.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <a href="/contact" className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-lime-500 text-black font-bold text-lg rounded-full transition-colors flex items-center justify-center gap-3 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-3">
                    <FileText size={20} /> Request Quote
                  </span>
                </a>
                <a href="https://wa.me/919354502422" target="_blank" className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-full transition-colors flex items-center justify-center gap-3 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-3">
                    <MessageCircle size={20} /> WhatsApp Us
                  </span>
                </a>
              </div>
            </div>
          </section>

          <Footer />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}

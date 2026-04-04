"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';

const heroPropertyImages = [
  "/imgi_12_-7189515740131590123.jpg",
  "/imgi_13_-3252337621568236283.jpg",
  "/imgi_14_1887428145382298790.jpg",
  "/imgi_16_-8442027838136868696.jpg",
  "/imgi_17_-5243027874929875930.jpg",
  "/imgi_18_8564039198595028051.jpg",
  "/imgi_19_-1281652502502408257.jpg",
  "/imgi_20_6008241602089556706.jpg",
  "/imgi_21_-4979929816751632401.jpg",
  "/imgi_22_-3680443779631392670.jpg",
];

function HeroImageBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = heroPropertyImages[0];
    img.onload = () => setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroPropertyImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextIndex = (currentIndex + 1) % heroPropertyImages.length;
    const img = new Image();
    img.src = heroPropertyImages[nextIndex];
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] } }}
          exit={{ opacity: 0, transition: { duration: 1.2 } }}
          className="absolute inset-0"
        >
          <motion.img
            src={heroPropertyImages[currentIndex]}
            alt="Houston luxury home"
            className="w-full h-full object-cover"
            animate={{ scale: [1, 1.06] }}
            transition={{ duration: 8, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Clean overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[hsl(220,60%,8%)]/50 via-transparent to-[hsl(220,80%,12%)]/40" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_80%)]" />
      <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Image indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
          {heroPropertyImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-400 rounded-full ${
                index === currentIndex ? 'w-6 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroContent({ heroContentRef }: { heroContentRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div 
      ref={heroContentRef}
      className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-24 md:pt-40 md:pb-28 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white/90 text-sm font-medium tracking-wide">
            Houston's Premier Real Estate Team
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold tracking-tight leading-[0.95]">
            <span className="block text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
              Buy or Sell Your
            </span>
            <span className="block mt-2 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
              Houston Home
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          15+ years of experience. 500+ families served. Expert guidance for buyers and sellers across Sugar Land, Katy, Cypress, Richmond & Missouri City.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            asChild 
            size="lg" 
            className="group px-8 h-14 text-base bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg"
          >
            <Link to="/listings">
              Browse Homes for Sale
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="px-8 h-14 text-base backdrop-blur-md bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:text-white"
          >
            <Link to="/home-valuation">
              Get Your Home's Value
            </Link>
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold">500+</span>
            <span>Homes Sold</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold">15+</span>
            <span>Years Experience</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold">5.0</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400" fill="currentColor" />
              ))}
            </div>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-white/70">eXp Realty</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement> }) {
  return (
    <motion.div
      ref={screenshotRef}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-20"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative rounded-t-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-black/50 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-white/60 font-medium">mikeogunkeye.com</span>
          </div>
        </div>
        <div className="aspect-video bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center">
          <img 
            src="/imgi_7_3e061cc4-19fe-4964-9802-0ef4ec5783d2.jpeg"
            alt="Luxury Home Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}

interface Hero3DProps {
  showScreenshot?: boolean;
  showSpline?: boolean;
}

const Hero3DSection = ({ showScreenshot = false }: Hero3DProps) => {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (screenshotRef.current && heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;
          if (screenshotRef.current) {
            screenshotRef.current.style.transform = `translateX(-50%) translateY(-${scrollPosition * 0.5}px)`;
          }
          const maxScroll = 400;
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 1);
          if (heroContentRef.current) {
            heroContentRef.current.style.opacity = opacity.toString();
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <HeroImageBackground />
      <HeroContent heroContentRef={heroContentRef} />
      {showScreenshot && <ScreenshotSection screenshotRef={screenshotRef} />}
    </section>
  );
};

export { Hero3DSection, HeroImageBackground, HeroContent, ScreenshotSection };

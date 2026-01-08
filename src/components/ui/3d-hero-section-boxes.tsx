"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';

// Property images for the rotating hero background
const heroPropertyImages = [
  "/imgi_10_7120993268281597033.jpg",
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
    // Preload first image
    const img = new Image();
    img.src = heroPropertyImages[0];
    img.onload = () => setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroPropertyImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % heroPropertyImages.length;
    const img = new Image();
    img.src = heroPropertyImages[nextIndex];
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 z-0">
      {/* Image slideshow - full visibility */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={heroPropertyImages[currentIndex]}
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Strong overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      {/* Vignette for cinematic feel */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* Bottom gradient for content area */}
      <div className="absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      
      {/* Image indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroPropertyImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'bg-white w-10 shadow-lg shadow-white/30' 
                : 'bg-white/40 w-1.5 hover:bg-white/60'
            }`}
            aria-label={`View property ${index + 1}`}
          />
        ))}
      </div>
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
      <div className="relative rounded-t-2xl overflow-hidden shadow-2xl border border-border/20 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/20">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted-foreground font-medium">mikeogunkeye.com</span>
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

function HeroContent({ heroContentRef }: { heroContentRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div 
      ref={heroContentRef}
      className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm shadow-lg">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Houston's Premier Real Estate
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6"
        >
          <span className="text-white drop-shadow-lg">Find Your</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent drop-shadow-lg">
            Dream Home
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="inline-flex items-center gap-3 text-sm md:text-base font-mono text-white/80 tracking-wider mb-8"
        >
          LUXURY • RESIDENTIAL • COMMERCIAL • INVESTMENT
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md"
        >
          Experience elevated real estate with personalized service, 
          expert market insights, and a commitment to finding your perfect property.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="group px-8 h-14 text-base shadow-xl">
            <Link to="/contact">
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group px-8 h-14 text-base backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
            <Link to="/listings">
              <Play className="mr-2 h-5 w-5" />
              Browse Listings
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
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
    <section className="relative min-h-screen overflow-hidden bg-background">
      <HeroImageBackground />
      
      <HeroContent heroContentRef={heroContentRef} />
      
      {showScreenshot && <ScreenshotSection screenshotRef={screenshotRef} />}
    </section>
  );
};

export { Hero3DSection, HeroImageBackground, HeroContent, ScreenshotSection };

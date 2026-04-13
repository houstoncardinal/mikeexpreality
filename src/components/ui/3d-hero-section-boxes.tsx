"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

  useEffect(() => {
    const img = new Image();
    img.src = heroPropertyImages[0];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroPropertyImages.length);
    }, 7000);
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.8, ease: [0.25, 0.1, 0.25, 1] } }}
          exit={{ opacity: 0, transition: { duration: 1.2 } }}
          className="absolute inset-0"
        >
          <motion.img
            src={heroPropertyImages[currentIndex]}
            alt="Houston luxury home"
            className="w-full h-full object-cover"
            animate={{ scale: [1, 1.04] }}
            transition={{ duration: 9, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Single clean gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
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
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-4xl mx-auto"
      >
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1]">
            <span className="block text-white">Buy or Sell Your</span>
            <span className="block mt-3 text-white/90">Houston Home</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed font-light"
        >
          Expert guidance across Sugar Land, Katy, Cypress, Richmond & Missouri City. 15+ years. 500+ families served.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            asChild 
            size="lg" 
            className="group px-8 h-14 text-base bg-white text-foreground hover:bg-white/90 font-semibold shadow-xl"
          >
            <Link to="/listings">
              Browse Homes
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="px-8 h-14 text-base border-white/25 text-white hover:bg-white/10 hover:border-white/40 hover:text-white bg-transparent"
          >
            <Link to="/home-valuation">
              Get Your Home's Value
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
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;
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
    <section className="relative min-h-screen overflow-hidden bg-foreground">
      <HeroImageBackground />
      <HeroContent heroContentRef={heroContentRef} />
    </section>
  );
};

export { Hero3DSection, HeroImageBackground, HeroContent };

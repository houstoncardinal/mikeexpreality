"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Diamond, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';

// Property images for the rotating hero background (professional home images only)
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

// Floating particle component
function FloatingParticle({ delay, duration, size, left, top }: { 
  delay: number; 
  duration: number; 
  size: number;
  left: string;
  top: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [0, -100, -200, -300],
        x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30, Math.random() * 80 - 40]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut"
      }}
    >
      <Diamond 
        className="text-amber-400/60" 
        style={{ width: size, height: size }}
        fill="currentColor"
      />
    </motion.div>
  );
}

// Animated star burst
function StarBurst() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star className="w-3 h-3 text-amber-300/50" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}

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

  // Generate floating particles
  const particles = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      delay: i * 0.8,
      duration: 4 + Math.random() * 3,
      size: 6 + Math.random() * 8,
      left: `${10 + Math.random() * 80}%`,
      top: `${60 + Math.random() * 30}%`
    })), []
  );

  return (
    <div className="absolute inset-0 z-0">
      {/* Ken Burns effect slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }
          }}
          exit={{ 
            opacity: 0, 
            scale: 1.05,
            transition: { duration: 1.2 }
          }}
          className="absolute inset-0"
        >
          <motion.img
            src={heroPropertyImages[currentIndex]}
            alt="Luxury Property"
            className="w-full h-full object-cover"
            animate={{ 
              scale: [1, 1.08],
            }}
            transition={{
              duration: 8,
              ease: "linear"
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Premium multi-layer overlay system */}
      {/* Base dark overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      
      {/* Royal blue tint overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[hsl(220,60%,8%)]/60 via-transparent to-[hsl(220,80%,12%)]/50" />
      
      {/* Golden accent glow */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-radial from-amber-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-1/3 h-1/2 bg-gradient-radial from-amber-400/8 via-transparent to-transparent blur-3xl" />
      </div>
      
      {/* Cinematic vignette */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Top gradient for header */}
      <div className="absolute inset-x-0 top-0 h-40 z-10 bg-gradient-to-b from-black/60 to-transparent" />
      
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-64 z-10 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* Star burst effects */}
      <StarBurst />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Premium image indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          {heroPropertyImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative transition-all duration-500 ${
                index === currentIndex 
                  ? 'w-8 h-2' 
                  : 'w-2 h-2 hover:bg-white/60'
              }`}
            >
              <span className={`absolute inset-0 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 shadow-lg shadow-amber-500/30' 
                  : 'bg-white/30'
              }`} />
              {index === currentIndex && (
                <motion.span 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/50 to-amber-300/50"
                  animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </button>
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
      className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6 pt-40 pb-24 md:pt-48 md:pb-28 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-5xl mx-auto"
      >
        {/* Premium badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border border-amber-400/30 backdrop-blur-xl shadow-2xl shadow-amber-500/10">
            <span className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-amber-400/20 animate-ping" />
              <Sparkles className="relative w-5 h-5 text-amber-400" />
            </span>
            <span className="text-amber-100 text-sm font-medium tracking-widest uppercase">
              Houston's Premier Real Estate
            </span>
            <Diamond className="w-3 h-3 text-amber-400/60" fill="currentColor" />
          </span>
        </motion.div>

        {/* Main headline with luxury typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative mb-8"
        >
          {/* Decorative line above */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-amber-400" />
            <Diamond className="w-3 h-3 text-amber-400" fill="currentColor" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-amber-400/50 to-amber-400" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-serif font-bold tracking-tight leading-[0.9]">
            <motion.span 
              className="block text-white drop-shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
            >
              Find Your
            </motion.span>
            <motion.span 
              className="relative block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <span className="relative bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl"
                style={{ textShadow: '0 0 80px rgba(251,191,36,0.3)' }}
              >
                Dream Home
              </span>
              {/* Animated shimmer overlay */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-clip-text text-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                style={{ 
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text'
                }}
              >
                Dream Home
              </motion.span>
            </motion.span>
          </h1>

          {/* Decorative line below */}
          <motion.div 
            className="flex items-center justify-center gap-4 mt-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-white/30" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400" fill="currentColor" />
              ))}
            </div>
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-white/30" />
          </motion.div>
        </motion.div>

        {/* Category tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-8"
        >
          {['LUXURY', 'RESIDENTIAL', 'COMMERCIAL', 'INVESTMENT'].map((tag, i) => (
            <span key={tag} className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-light tracking-[0.3em] text-white/70">
                {tag}
              </span>
              {i < 3 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              )}
            </span>
          ))}
        </motion.div>

        {/* Description with urgency */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed font-light"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          Experience elevated real estate with personalized service, 
          expert market insights, and a commitment to finding your perfect property.
        </motion.p>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-amber-400/30 backdrop-blur-sm"
        >
          <motion.div 
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-amber-100">
            🔥 Houston market is hot — <span className="text-amber-300">47 new listings</span> this week!
          </span>
        </motion.div>

        {/* CTA Buttons - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Button 
            asChild 
            size="lg" 
            className="group relative px-10 h-16 text-base overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:via-amber-300 hover:to-amber-400 text-black font-semibold shadow-2xl shadow-amber-500/25 border-0"
          >
            <Link to="/contact">
              <span className="relative z-10 flex items-center">
                Get FREE Consultation
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="group px-10 h-16 text-base backdrop-blur-xl bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover:text-white shadow-2xl"
          >
            <Link to="/home-valuation">
              <Star className="mr-3 h-5 w-5 text-amber-400" />
              What's My Home Worth?
            </Link>
          </Button>
        </motion.div>
        
        {/* Sub-CTA for listings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-5"
        >
          <Link 
            to="/listings" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
          >
            <Play className="h-4 w-4 text-amber-400" />
            Or browse available properties →
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">500+</span>
            <span>Homes Sold</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">15+</span>
            <span>Years Experience</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">5.0</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400" fill="currentColor" />
              ))}
            </div>
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

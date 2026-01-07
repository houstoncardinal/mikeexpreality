"use client";

import React, { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';

function HeroSplineBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background z-10" />
      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        className="w-full h-full"
      />
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
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop"
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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
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
          <span className="text-foreground">Find Your</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent">
            Dream Home
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="inline-flex items-center gap-3 text-sm md:text-base font-mono text-muted-foreground tracking-wider mb-8"
        >
          LUXURY • RESIDENTIAL • COMMERCIAL • INVESTMENT
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
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
          <Button asChild size="lg" className="group px-8 h-14 text-base">
            <Link to="/contact">
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group px-8 h-14 text-base backdrop-blur-sm">
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

const Hero3DSection = ({ showScreenshot = false, showSpline = true }: Hero3DProps) => {
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
      {showSpline && <HeroSplineBackground />}
      
      {/* Fallback gradient if Spline doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <HeroContent heroContentRef={heroContentRef} />
      
      {showScreenshot && <ScreenshotSection screenshotRef={screenshotRef} />}
    </section>
  );
};

export { Hero3DSection, HeroSplineBackground, HeroContent, ScreenshotSection };

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { Crown, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950"
        >
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient orbs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-royal/20 rounded-full blur-[100px]"
            />
            
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  y: Math.random() * 100 + 50,
                  x: Math.random() * window.innerWidth 
                }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  y: -100,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 1.5,
                  ease: "easeOut",
                }}
                className="absolute w-1 h-1 bg-accent rounded-full"
                style={{ left: `${Math.random() * 100}%`, bottom: "0%" }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative flex flex-col items-center">
            {/* Crown Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 30px rgba(212, 175, 55, 0.3)",
                      "0 0 60px rgba(212, 175, 55, 0.5)",
                      "0 0 30px rgba(212, 175, 55, 0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent via-accent/90 to-amber-600 flex items-center justify-center"
                >
                  <Crown className="w-10 h-10 text-accent-foreground" />
                </motion.div>
                
                {/* Sparkle accents */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                </motion.div>
              </div>
            </motion.div>

            {/* Logo Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {siteConfig.agent.name}
                </motion.span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium"
              >
                {siteConfig.brokerage}
              </motion.p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-sm text-slate-400 tracking-wide"
            >
              Luxury Real Estate Excellence
            </motion.p>

            {/* Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-accent via-amber-500 to-accent rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

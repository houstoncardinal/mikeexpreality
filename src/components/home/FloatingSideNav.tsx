import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Building2, 
  MapPin, 
  Trophy, 
  Calculator, 
  Phone,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  sectionId: string;
}

const navItems: NavItem[] = [
  { id: 'hero', icon: Home, label: 'Home', sectionId: 'hero-section' },
  { id: 'listings', icon: Building2, label: 'Listings', sectionId: 'featured-listings' },
  { id: 'neighborhoods', icon: MapPin, label: 'Areas', sectionId: 'neighborhoods' },
  { id: 'stats', icon: Trophy, label: 'Results', sectionId: 'stats-section' },
  { id: 'calculator', icon: Calculator, label: 'Calculator', sectionId: 'mls-search' },
  { id: 'contact', icon: Phone, label: 'Contact', sectionId: 'cta-section' },
];

export const FloatingSideNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-section');
  const [isVisible, setIsVisible] = useState(false);

  // Show nav after initial page load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.sectionId,
        element: document.getElementById(item.sectionId)
      }));

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        >
          <motion.div
            className="relative"
            animate={{ width: isExpanded ? 180 : 64 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            {/* Outer glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-b from-accent/20 via-primary/10 to-accent/20 rounded-3xl blur-xl opacity-60" />
            
            {/* Main container */}
            <div className="relative bg-white border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-accent via-primary to-accent" />
              
              {/* Header with logo/icon */}
              <div className="px-3 py-4 border-b border-border/50">
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="ml-3 overflow-hidden"
                      >
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Navigate</p>
                        <p className="text-sm font-semibold text-foreground">Sections</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation items */}
              <nav className="py-3 px-2">
                <ul className="space-y-1">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.sectionId;
                    
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <button
                          onClick={() => scrollToSection(item.sectionId)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-xl
                            transition-all duration-300 group relative overflow-hidden
                            ${isActive 
                              ? 'bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg shadow-accent/25' 
                              : 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                            }
                          `}
                        >
                          {/* Hover shimmer effect */}
                          {!isActive && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </div>
                          )}
                          
                          {/* Active indicator line */}
                          <motion.div
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ${
                              isActive ? 'h-8 bg-white' : 'h-0 bg-accent'
                            }`}
                            layoutId="navIndicator"
                          />
                          
                          {/* Icon container */}
                          <div className={`
                            relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                            transition-all duration-300
                            ${isActive 
                              ? 'bg-white/20' 
                              : 'bg-muted/50 group-hover:bg-accent/10 group-hover:scale-105'
                            }
                          `}>
                            <Icon className={`w-5 h-5 transition-all duration-300 ${
                              isActive ? 'text-white' : 'text-muted-foreground group-hover:text-accent'
                            }`} />
                          </div>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.15 }}
                                className="flex-1 text-left overflow-hidden"
                              >
                                <span className={`text-sm font-semibold whitespace-nowrap ${
                                  isActive ? 'text-white' : ''
                                }`}>
                                  {item.label}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Active badge */}
                          <AnimatePresence>
                            {isActive && isExpanded && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-2 h-2 rounded-full bg-white animate-pulse"
                              />
                            )}
                          </AnimatePresence>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom section with progress indicator */}
              <div className="px-3 pb-4 pt-2 border-t border-border/50">
                <div className="flex items-center justify-center gap-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSection === item.sectionId 
                          ? 'w-4 bg-accent' 
                          : 'w-1.5 bg-border hover:bg-muted-foreground cursor-pointer'
                      }`}
                      onClick={() => scrollToSection(item.sectionId)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

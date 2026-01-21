import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Building2, 
  MapPin, 
  Trophy, 
  Calculator, 
  Phone,
  ChevronLeft,
  ChevronRight
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
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
    >
      <motion.div
        className="relative bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
        animate={{ width: isExpanded ? 160 : 56 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        >
          {isExpanded ? (
            <ChevronLeft className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>

        {/* Navigation items */}
        <nav className="py-3 px-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.sectionId;
              
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <button
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-300 group relative
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

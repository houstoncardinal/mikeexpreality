import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Building2, 
  MapPin, 
  Trophy, 
  Calculator, 
  Phone
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
  { id: 'calculator', icon: Calculator, label: 'Tools', sectionId: 'mls-search' },
  { id: 'contact', icon: Phone, label: 'Contact', sectionId: 'cta-section' },
];

export const FloatingSideNav = () => {
  const [activeSection, setActiveSection] = useState('hero-section');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

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
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1"
          aria-label="Page navigation"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.sectionId;
            const isHovered = hoveredItem === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => scrollToSection(item.sectionId)}
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'bg-accent text-accent-foreground shadow-md' 
                      : 'bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-card border border-border/50'
                    }
                  `}
                  aria-label={item.label}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <Icon className="w-4 h-4" />
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap pointer-events-none"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

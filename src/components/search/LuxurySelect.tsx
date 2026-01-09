import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LuxurySelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
}

interface LuxurySelectProps {
  options: LuxurySelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
}

export function LuxurySelect({
  options,
  value,
  onChange,
  placeholder,
  icon,
  className,
}: LuxurySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, options, onChange]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 px-4 rounded-lg",
          "bg-secondary/80 backdrop-blur-sm",
          "border border-border/50 hover:border-accent/30",
          "flex items-center gap-3",
          "transition-all duration-300",
          "group cursor-pointer",
          isOpen && "border-accent/50 shadow-royal"
        )}
        whileTap={{ scale: 0.98 }}
      >
        {/* Left Icon */}
        {icon && (
          <span className={cn(
            "text-muted-foreground transition-colors duration-300",
            "group-hover:text-accent",
            isOpen && "text-accent"
          )}>
            {icon}
          </span>
        )}

        {/* Selected Value */}
        <span className={cn(
          "flex-1 text-left truncate text-sm font-medium",
          selectedOption ? "text-foreground" : "text-muted-foreground"
        )}>
          {selectedOption?.label || placeholder}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "text-muted-foreground transition-colors duration-300",
            "group-hover:text-accent",
            isOpen && "text-accent"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2",
              "bg-white dark:bg-slate-900",
              "border border-border",
              "rounded-xl overflow-hidden",
              "shadow-2xl"
            )}
            style={{
              zIndex: 9999,
              boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.25), 0 10px 30px -10px rgba(0, 0, 0, 0.15)"
            }}
          >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            
            {/* Options List */}
            <div className="max-h-80 overflow-y-auto py-2 scrollbar-thin">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "w-full px-4 py-3 flex items-start gap-3",
                    "transition-all duration-200",
                    "relative group/item",
                    highlightedIndex === index && "bg-accent/8",
                    value === option.value && "bg-accent/12"
                  )}
                >
                  {/* Hover/Active Indicator */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: highlightedIndex === index || value === option.value ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Icon */}
                  {option.icon && (
                    <span className={cn(
                      "flex-shrink-0 mt-0.5",
                      "text-muted-foreground transition-colors duration-200",
                      "group-hover/item:text-accent",
                      value === option.value && "text-accent"
                    )}>
                      {option.icon}
                    </span>
                  )}

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-medium text-sm transition-colors duration-200",
                        "text-foreground/90",
                        "group-hover/item:text-foreground",
                        value === option.value && "text-accent"
                      )}>
                        {option.label}
                      </span>
                      {option.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent/15 text-accent rounded">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {option.description}
                      </p>
                    )}
                  </div>

                  {/* Check Mark */}
                  {value === option.value && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0 text-accent"
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

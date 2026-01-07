import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown, Languages } from "lucide-react";
import { useTranslation, languages, Language } from "@/contexts/TranslationContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "header" | "topbar" | "mobile" | "floating";
  className?: string;
}

export function LanguageSwitcher({ variant = "header", className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(l => l.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Topbar variant - ultra compact for dark top bar
  if (variant === "topbar") {
    return (
      <div ref={dropdownRef} className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <span className="text-sm">{currentLanguage?.flag}</span>
          <span className="font-medium">{currentLanguage?.code.toUpperCase()}</span>
          <ChevronDown className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-[100]"
            >
              <div className="p-1.5 max-h-64 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left text-sm",
                      language === lang.code
                        ? "bg-accent/20 text-accent"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1 font-medium truncate">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="h-4 w-4 text-accent shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Header variant - sleek button integrated into main header
  if (variant === "header") {
    return (
      <div ref={dropdownRef} className={cn("relative", className)}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
            "bg-secondary/50 hover:bg-secondary border border-border/50",
            isOpen && "bg-secondary ring-2 ring-accent/20"
          )}
        >
          <Globe className="h-4 w-4 text-accent" />
          <span className="text-lg leading-none">{currentLanguage?.flag}</span>
          <span className="text-sm font-medium text-foreground hidden xl:inline">
            {currentLanguage?.code.toUpperCase()}
          </span>
          <ChevronDown className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-full right-0 mt-2 w-64 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-[100]"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-secondary/30 border-b border-border">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">Select Language</span>
                </div>
              </div>

              {/* Language Grid */}
              <div className="p-2 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-2 gap-1">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(lang.code)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all text-left",
                        language === lang.code
                          ? "bg-accent/10 ring-1 ring-accent/30"
                          : "hover:bg-secondary"
                      )}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          language === lang.code ? "text-accent" : "text-foreground"
                        )}>
                          {lang.code.toUpperCase()}
                        </p>
                      </div>
                      {language === lang.code && (
                        <Check className="h-4 w-4 text-accent shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-secondary/20 border-t border-border">
                <p className="text-[11px] text-muted-foreground text-center">
                  Content will be translated to {currentLanguage?.name}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mobile variant - full width card style
  if (variant === "mobile") {
    return (
      <div ref={dropdownRef} className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
            "bg-secondary/30 hover:bg-secondary/50",
            isOpen && "bg-secondary/50"
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentLanguage?.flag}</span>
              <span className="text-sm font-medium text-foreground">{currentLanguage?.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">Tap to change language</span>
          </div>
          <ChevronDown className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 grid grid-cols-2 gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-left",
                      language === lang.code
                        ? "bg-accent/10 text-accent"
                        : "bg-secondary/30 text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium truncate">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="h-4 w-4 text-accent shrink-0 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Floating variant (legacy support)
  return (
    <div className={cn("fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40", className)}>
      <div ref={dropdownRef} className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-card shadow-lg border border-border hover:shadow-xl transition-shadow"
        >
          <Globe className="h-5 w-5 text-accent" />
          <span className="text-lg">{currentLanguage?.flag}</span>
          <span className="hidden sm:inline text-sm font-medium text-foreground">
            {currentLanguage?.code.toUpperCase()}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-full left-0 mb-2 w-64 bg-card rounded-xl shadow-2xl border border-border overflow-hidden z-50"
            >
              <div className="p-3 border-b border-border bg-secondary/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Select Language
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left",
                      language === lang.code
                        ? "bg-accent/10 text-accent"
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lang.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lang.nativeName}
                      </p>
                    </div>
                    {language === lang.code && (
                      <Check className="h-5 w-5 text-accent shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

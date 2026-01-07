import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation, languages, Language } from "@/contexts/TranslationContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "header" | "footer" | "floating";
  className?: string;
}

export function LanguageSwitcher({ variant = "header", className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(l => l.code === language);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "floating") {
    return (
      <div className={cn("fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40", className)}>
        <div className="relative">
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
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
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
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Header variant (compact dropdown)
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage?.code.toUpperCase()}
        </span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50"
            >
              <div className="max-h-72 overflow-y-auto p-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left",
                      language === lang.code
                        ? "bg-accent/10 text-accent"
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lang.name}</p>
                    </div>
                    {language === lang.code && (
                      <Check className="h-4 w-4 text-accent shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

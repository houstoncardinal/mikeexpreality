import { X, Scale, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";

export function ComparisonBar() {
  const { comparisonList, removeFromComparison, clearComparison, setIsComparisonOpen } = useComparison();

  if (comparisonList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-xl border-t border-royal/30 py-4 shadow-2xl"
      >
        <div className="container-custom flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Scale className="w-5 h-5 text-royal-light" />
              <span className="font-medium">Compare ({comparisonList.length}/3)</span>
            </div>
            <div className="flex items-center gap-3">
              {comparisonList.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"
                >
                  <img
                    src={property.images[0]}
                    alt={property.address}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span className="text-white text-sm max-w-[150px] truncate">
                    {property.address}
                  </span>
                  <button
                    onClick={() => removeFromComparison(property.id)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearComparison}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={() => setIsComparisonOpen(true)}
              className="bg-royal hover:bg-royal-dark text-white"
              disabled={comparisonList.length < 2}
            >
              <Scale className="w-4 h-4 mr-2" />
              Compare Now
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

import React, { createContext, useContext, useState, useCallback } from "react";
import { PropertyListing } from "@/lib/listingsData";
import { toast } from "sonner";

interface ComparisonContextType {
  comparisonList: PropertyListing[];
  addToComparison: (property: PropertyListing) => void;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonList, setComparisonList] = useState<PropertyListing[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const addToComparison = useCallback((property: PropertyListing) => {
    setComparisonList((prev) => {
      if (prev.length >= 3) {
        toast.error("Maximum 3 properties can be compared at once");
        return prev;
      }
      if (prev.some((p) => p.id === property.id)) {
        toast.info("Property already in comparison");
        return prev;
      }
      toast.success(`${property.address} added to comparison`);
      return [...prev, property];
    });
  }, []);

  const removeFromComparison = useCallback((propertyId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== propertyId));
    toast.info("Property removed from comparison");
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
    setIsComparisonOpen(false);
  }, []);

  const isInComparison = useCallback(
    (propertyId: string) => comparisonList.some((p) => p.id === propertyId),
    [comparisonList]
  );

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        isComparisonOpen,
        setIsComparisonOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}

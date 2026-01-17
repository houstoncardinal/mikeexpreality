import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bookmark,
  Bell,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchFilters {
  search?: string;
  city?: string;
  propertyType?: string;
  priceRange?: string;
  minBeds?: number;
  minBaths?: number;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  notify_email: boolean;
  created_at: string;
}

interface SavedSearchDialogProps {
  currentFilters: SearchFilters;
  trigger?: React.ReactNode;
}

export function SavedSearchDialog({ currentFilters, trigger }: SavedSearchDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [showSaveForm, setShowSaveForm] = useState(false);

  const fetchSavedSearches = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedSearches((data || []).map(item => ({
        ...item,
        filters: item.filters as unknown as SearchFilters
      })));
    } catch (err) {
      console.error("Error fetching saved searches:", err);
    } finally {
      setIsLoading(false);
    }
  };
      console.error("Error fetching saved searches:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchSavedSearches();
      setShowSaveForm(false);
      setNewSearchName("");
    }
  };

  const handleSaveSearch = async () => {
    if (!user || !newSearchName.trim()) {
      toast.error("Please enter a name for your search");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("saved_searches").insert([{
        user_id: user.id,
        name: newSearchName.trim(),
        filters: currentFilters as unknown as Record<string, unknown>,
        notify_email: notifyEmail,
      }]);

      if (error) throw error;

      toast.success("Search saved successfully!");
      setNewSearchName("");
      setShowSaveForm(false);
      fetchSavedSearches();
    } catch (err) {
      console.error("Error saving search:", err);
      toast.error("Failed to save search");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_searches")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Search deleted");
      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting search:", err);
      toast.error("Failed to delete search");
    }
  };

  const handleToggleNotify = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("saved_searches")
        .update({ notify_email: !currentValue })
        .eq("id", id);

      if (error) throw error;

      setSavedSearches((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, notify_email: !currentValue } : s
        )
      );
      toast.success(
        !currentValue ? "Email notifications enabled" : "Email notifications disabled"
      );
    } catch (err) {
      console.error("Error updating notification settings:", err);
      toast.error("Failed to update settings");
    }
  };

  const handleApplySearch = (filters: SearchFilters) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.city) params.set("city", filters.city);
    if (filters.propertyType) params.set("type", filters.propertyType);
    if (filters.priceRange) params.set("price", filters.priceRange);
    if (filters.minBeds) params.set("beds", String(filters.minBeds));
    if (filters.minBaths) params.set("baths", String(filters.minBaths));

    navigate(`/map-search?${params.toString()}`);
    setOpen(false);
  };

  const getFilterSummary = (filters: SearchFilters) => {
    const parts: string[] = [];
    if (filters.city) parts.push(filters.city);
    if (filters.propertyType) parts.push(filters.propertyType);
    if (filters.priceRange) parts.push(filters.priceRange);
    if (filters.minBeds) parts.push(`${filters.minBeds}+ beds`);
    return parts.length > 0 ? parts.join(" • ") : "All properties";
  };

  if (!user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Save Search
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to save searches and receive notifications when new
              matching properties are added.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Bookmark className="h-4 w-4" />
            Save Search
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            Saved Searches
          </DialogTitle>
          <DialogDescription>
            Save your search criteria and get notified when new matching
            properties are listed.
          </DialogDescription>
        </DialogHeader>

        {/* Save New Search Form */}
        {showSaveForm ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-name">Search Name</Label>
              <Input
                id="search-name"
                placeholder="e.g., Katy 4+ Bedrooms"
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-email" className="text-sm">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when new properties match
                </p>
              </div>
              <Switch
                id="notify-email"
                checked={notifyEmail}
                onCheckedChange={setNotifyEmail}
              />
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">
                Current filters:
              </p>
              <p className="text-sm font-medium">
                {getFilterSummary(currentFilters)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSaveForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveSearch}
                disabled={isSaving || !newSearchName.trim()}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Saved Searches List */}
            <ScrollArea className="max-h-[300px] py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : savedSearches.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No saved searches yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedSearches.map((search) => (
                    <div
                      key={search.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {search.name}
                            </p>
                            {search.notify_email && (
                              <Badge variant="secondary" className="text-xs">
                                <Bell className="h-3 w-3 mr-1" />
                                Alerts
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {getFilterSummary(search.filters)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleToggleNotify(search.id, search.notify_email)
                            }
                            title={
                              search.notify_email
                                ? "Disable notifications"
                                : "Enable notifications"
                            }
                          >
                            <Bell
                              className={cn(
                                "h-4 w-4",
                                search.notify_email
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteSearch(search.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 gap-2"
                        onClick={() => handleApplySearch(search.filters)}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Apply Search
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <DialogFooter>
              <Button onClick={() => setShowSaveForm(true)} className="w-full">
                <Bookmark className="h-4 w-4 mr-2" />
                Save Current Search
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

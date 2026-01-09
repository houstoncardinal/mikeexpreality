import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Heart,
  Calculator,
  MessageCircle,
  User,
  Settings,
  X,
  ChevronUp,
  ChevronDown,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Star,
  Share2,
  Bookmark,
  Phone,
  Mail,
  Calendar,
  Filter,
  SlidersHorizontal,
  Zap,
  TrendingUp,
  Camera,
  Mic,
  Send,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info,
  Navigation,
  Clock,
  Users,
  Award,
  Shield,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/siteConfig";
import { allListings, formatPrice } from "@/lib/listingsData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type ToolbarView =
  | "home"
  | "search"
  | "favorites"
  | "calculator"
  | "profile"
  | "settings"
  | "quick-search"
  | "mortgage-calc"
  | "property-details"
  | "contact-agent"
  | "schedule-tour"
  | "share-property"
  | "voice-search"
  | "camera-search"
  | "nearby-properties"
  | "market-insights"
  | "saved-searches"
  | "recently-viewed";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  priceType: "sale" | "lease";
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  featured?: boolean;
}

export function MobileToolbar() {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState<ToolbarView>("home");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  // Quick Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [propertyType, setPropertyType] = useState("");

  // Mortgage Calculator State
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Voice Search State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // Load data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Load favorites, recently viewed, saved searches from localStorage or API
    const savedFavorites = localStorage.getItem('favorites');
    const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
    const savedSearchesData = localStorage.getItem('savedSearches');

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(savedRecentlyViewed));
    }
    if (savedSearchesData) {
      setSavedSearches(JSON.parse(savedSearchesData));
    }
  };

  const toggleFavorite = (property: Property) => {
    const newFavorites = favorites.some(fav => fav.id === property.id)
      ? favorites.filter(fav => fav.id !== property.id)
      : [...favorites, property];

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    toast.success(
      newFavorites.length > favorites.length ? "Added to favorites" : "Removed from favorites"
    );
  };

  const addToRecentlyViewed = (property: Property) => {
    const newRecentlyViewed = [property, ...recentlyViewed.filter(p => p.id !== property.id)].slice(0, 10);
    setRecentlyViewed(newRecentlyViewed);
    localStorage.setItem('recentlyViewed', JSON.stringify(newRecentlyViewed));
  };

  const openPopup = (view: ToolbarView) => {
    setActiveView(view);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setActiveView("home"), 300);
  };

  const calculateMortgage = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: (monthlyPayment * numberOfPayments).toFixed(2),
      totalInterest: (monthlyPayment * numberOfPayments - principal).toFixed(2)
    };
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice search not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Speak your search criteria");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setSearchQuery(transcript);
      setIsListening(false);
      toast.success("Voice search captured");
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice search failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const toolbarItems = [
    {
      id: "home" as ToolbarView,
      icon: Home,
      label: "Home",
      color: "text-blue-500",
      action: () => navigate("/")
    },
    {
      id: "search" as ToolbarView,
      icon: Search,
      label: "Search",
      color: "text-emerald-500",
      action: () => openPopup("quick-search")
    },
    {
      id: "favorites" as ToolbarView,
      icon: Heart,
      label: "Favorites",
      color: "text-rose-500",
      badge: favorites.length > 0 ? favorites.length : undefined,
      action: () => openPopup("favorites")
    },
    {
      id: "calculator" as ToolbarView,
      icon: Calculator,
      label: "Calculator",
      color: "text-purple-500",
      action: () => openPopup("mortgage-calc")
    },
    {
      id: "profile" as ToolbarView,
      icon: User,
      label: "Profile",
      color: "text-amber-500",
      action: () => openPopup("profile")
    }
  ];

  const quickActions = [
    { id: "voice-search" as ToolbarView, icon: Mic, label: "Voice Search", color: "text-blue-500" },
    { id: "camera-search" as ToolbarView, icon: Camera, label: "Visual Search", color: "text-green-500" },
    { id: "nearby-properties" as ToolbarView, icon: Navigation, label: "Nearby", color: "text-purple-500" },
    { id: "market-insights" as ToolbarView, icon: TrendingUp, label: "Market", color: "text-orange-500" },
    { id: "saved-searches" as ToolbarView, icon: Bookmark, label: "Saved", color: "text-pink-500" },
    { id: "recently-viewed" as ToolbarView, icon: Clock, label: "Recent", color: "text-indigo-500" }
  ];

  const mortgageCalc = calculateMortgage();

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={closePopup}
          />
        )}
      </AnimatePresence>

      {/* Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-card max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 p-4 text-accent-foreground relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold capitalize">
                    {activeView.replace("-", " ")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closePopup}
                    className="text-accent-foreground hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <AnimatePresence mode="wait">
                  {/* Quick Search */}
                  {activeView === "quick-search" && (
                    <motion.div
                      key="quick-search"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search properties..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleVoiceSearch}
                          className={cn(isListening && "bg-red-500 text-white animate-pulse")}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>

                      {voiceTranscript && (
                        <div className="p-3 bg-secondary rounded-lg">
                          <p className="text-sm text-muted-foreground">Voice input:</p>
                          <p className="text-sm font-medium">{voiceTranscript}</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Price Range</label>
                          <div className="px-2">
                            <Slider
                              value={priceRange}
                              onValueChange={setPriceRange}
                              max={2000000}
                              min={0}
                              step={10000}
                              className="mt-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>${priceRange[0].toLocaleString()}</span>
                              <span>${priceRange[1].toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Bedrooms</label>
                            <Select value={bedrooms.toString()} onValueChange={(v) => setBedrooms(parseInt(v))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Any</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                                <SelectItem value="4">4+</SelectItem>
                                <SelectItem value="5">5+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Bathrooms</label>
                            <Select value={bathrooms.toString()} onValueChange={(v) => setBathrooms(parseInt(v))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Any</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                                <SelectItem value="4">4+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => {
                            navigate(`/listings?search=${searchQuery}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&beds=${bedrooms}&baths=${bathrooms}`);
                            closePopup();
                          }}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Search Properties
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Favorites */}
                  {activeView === "favorites" && (
                    <motion.div
                      key="favorites"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {favorites.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No favorites yet</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                              navigate("/listings");
                              closePopup();
                            }}
                          >
                            Browse Properties
                          </Button>
                        </div>
                      ) : (
                        favorites.map((property) => (
                          <div
                            key={property.id}
                            className="flex gap-3 p-3 rounded-lg border hover:bg-secondary cursor-pointer"
                            onClick={() => {
                              navigate(`/property/${property.id}`);
                              closePopup();
                            }}
                          >
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{property.title}</p>
                              <p className="text-xs text-muted-foreground">{property.address}</p>
                              <p className="text-sm font-bold text-accent">
                                {formatPrice(property.price, property.priceType)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(property);
                              }}
                            >
                              <Heart className="h-4 w-4 fill-current text-rose-500" />
                            </Button>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* Mortgage Calculator */}
                  {activeView === "mortgage-calc" && (
                    <motion.div
                      key="mortgage-calc"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Home Price</label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={homePrice}
                              onChange={(e) => setHomePrice(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Down Payment</label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={downPayment}
                              onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Interest Rate (%)</label>
                            <Input
                              type="number"
                              step="0.1"
                              value={interestRate}
                              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Loan Term (years)</label>
                            <Select value={loanTerm.toString()} onValueChange={(v) => setLoanTerm(parseInt(v))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 years</SelectItem>
                                <SelectItem value="20">20 years</SelectItem>
                                <SelectItem value="30">30 years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Monthly Payment</span>
                            <span className="font-bold text-lg">${mortgageCalc.monthlyPayment}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Total Payment</span>
                            <span>${mortgageCalc.totalPayment}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Total Interest</span>
                            <span>${mortgageCalc.totalInterest}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Profile */}
                  {activeView === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mx-auto mb-4">
                          <User className="h-8 w-8 text-accent-foreground" />
                        </div>
                        <h4 className="font-medium">Guest User</h4>
                        <p className="text-sm text-muted-foreground">Sign in for personalized experience</p>
                      </div>

                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => {
                            navigate("/auth");
                            closePopup();
                          }}
                        >
                          Sign In / Sign Up
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => openPopup("contact-agent")}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Agent
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Contact Agent */}
                  {activeView === "contact-agent" && (
                    <motion.div
                      key="contact-agent"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <h4 className="font-medium">Contact Our Agent</h4>
                        <p className="text-sm text-muted-foreground">Get personalized assistance</p>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder="Your name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                        />
                        <Input
                          placeholder="Email address"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                        <Input
                          placeholder="Phone number"
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                        <Textarea
                          placeholder="How can we help you?"
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          rows={3}
                        />
                        <Button className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Recently Viewed */}
                  {activeView === "recently-viewed" && (
                    <motion.div
                      key="recently-viewed"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {recentlyViewed.length === 0 ? (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No recently viewed properties</p>
                        </div>
                      ) : (
                        recentlyViewed.map((property) => (
                          <div
                            key={property.id}
                            className="flex gap-3 p-3 rounded-lg border hover:bg-secondary cursor-pointer"
                            onClick={() => {
                              navigate(`/property/${property.id}`);
                              closePopup();
                            }}
                          >
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{property.title}</p>
                              <p className="text-xs text-muted-foreground">{property.address}</p>
                              <p className="text-sm font-bold text-accent">
                                {formatPrice(property.price, property.priceType)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toolbar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-xl border-t border-border"
      >
        {/* Quick Actions Row (when expanded) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border bg-secondary/30"
            >
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => openPopup(action.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-background transition-colors"
                    >
                      <div className={cn("p-2 rounded-lg", action.color.replace("text-", "bg-") + "/20")}>
                        <action.icon className={cn("h-5 w-5", action.color)} />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toolbar */}
        <div className="flex items-center justify-around p-2">
          {toolbarItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="relative flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-secondary transition-colors"
            >
              <div className="relative">
                <item.icon className={cn("h-6 w-6", item.color)} />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-secondary transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="h-6 w-6 text-muted-foreground" />
            </motion.div>
            <span className="text-xs font-medium text-muted-foreground">
              {isExpanded ? "Less" : "More"}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Safe area for mobile devices */}
      <div className="h-20 md:h-16" />
    </>
  );
}

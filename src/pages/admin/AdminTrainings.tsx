import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  GraduationCap,
  Play,
  Clock,
  Calendar,
  Users,
  Award,
  BookOpen,
  Video,
  CheckCircle,
  Star,
  TrendingUp,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Download,
  MoreHorizontal,
  FileText,
  Target,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";


interface Training {
  id: string;
  title: string;
  description: string;
  category: "sales" | "marketing" | "compliance" | "technology" | "leadership" | "product";
  type: "live" | "recorded" | "document";
  duration_minutes: number;
  scheduled_at: string | null;
  instructor: string;
  thumbnail: string | null;
  is_mandatory: boolean;
  completion_rate: number;
  attendees: number;
  max_attendees: number | null;
  rating: number;
  resources: { name: string; url: string }[];
  status: "upcoming" | "live" | "completed" | "available";
}

// Mock training data
const mockTrainings: Training[] = [
  {
    id: "1",
    title: "eXp Realty Q1 2024 Market Update",
    description: "Comprehensive overview of current market trends, interest rates, and eXp Realty updates.",
    category: "sales",
    type: "live",
    duration_minutes: 60,
    scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    instructor: "John Maxwell",
    thumbnail: null,
    is_mandatory: true,
    completion_rate: 0,
    attendees: 45,
    max_attendees: 100,
    rating: 0,
    resources: [],
    status: "upcoming",
  },
  {
    id: "2",
    title: "Advanced Luxury Marketing Strategies",
    description: "Learn high-end marketing techniques for luxury properties, including staging, photography, and social media.",
    category: "marketing",
    type: "recorded",
    duration_minutes: 90,
    scheduled_at: null,
    instructor: "Sarah Chen",
    thumbnail: null,
    is_mandatory: false,
    completion_rate: 67,
    attendees: 234,
    max_attendees: null,
    rating: 4.8,
    resources: [
      { name: "Marketing Checklist", url: "#" },
      { name: "Template Pack", url: "#" },
    ],
    status: "available",
  },
  {
    id: "3",
    title: "Texas Real Estate Commission Updates 2024",
    description: "Required compliance training covering new TREC regulations and licensing requirements.",
    category: "compliance",
    type: "recorded",
    duration_minutes: 45,
    scheduled_at: null,
    instructor: "TREC Official",
    thumbnail: null,
    is_mandatory: true,
    completion_rate: 89,
    attendees: 156,
    max_attendees: null,
    rating: 4.2,
    resources: [
      { name: "TREC Guidelines PDF", url: "#" },
    ],
    status: "available",
  },
  {
    id: "4",
    title: "CRM Mastery - Maximizing Lead Conversion",
    description: "Deep dive into using the CRM effectively to track leads, automate follow-ups, and close more deals.",
    category: "technology",
    type: "live",
    duration_minutes: 75,
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    instructor: "Mike Rodriguez",
    thumbnail: null,
    is_mandatory: false,
    completion_rate: 0,
    attendees: 28,
    max_attendees: 50,
    rating: 0,
    resources: [],
    status: "upcoming",
  },
  {
    id: "5",
    title: "Negotiation Masterclass",
    description: "Advanced negotiation tactics for getting the best deals for your clients.",
    category: "sales",
    type: "recorded",
    duration_minutes: 120,
    scheduled_at: null,
    instructor: "Chris Voss",
    thumbnail: null,
    is_mandatory: false,
    completion_rate: 45,
    attendees: 312,
    max_attendees: null,
    rating: 4.9,
    resources: [
      { name: "Negotiation Scripts", url: "#" },
      { name: "Role-play Exercises", url: "#" },
    ],
    status: "available",
  },
  {
    id: "6",
    title: "Building Your Personal Brand",
    description: "Create a compelling personal brand that attracts clients and builds trust.",
    category: "marketing",
    type: "document",
    duration_minutes: 30,
    scheduled_at: null,
    instructor: "Amy Williams",
    thumbnail: null,
    is_mandatory: false,
    completion_rate: 100,
    attendees: 89,
    max_attendees: null,
    rating: 4.5,
    resources: [
      { name: "Brand Guidelines Template", url: "#" },
      { name: "Social Media Calendar", url: "#" },
    ],
    status: "completed",
  },
];

const categoryConfig: Record<string, { label: string; color: string; icon: any }> = {
  sales: { label: "Sales", color: "bg-blue-500/15 text-blue-600", icon: TrendingUp },
  marketing: { label: "Marketing", color: "bg-purple-500/15 text-purple-600", icon: Target },
  compliance: { label: "Compliance", color: "bg-red-500/15 text-red-600", icon: FileText },
  technology: { label: "Technology", color: "bg-emerald-500/15 text-emerald-600", icon: Zap },
  leadership: { label: "Leadership", color: "bg-amber-500/15 text-amber-600", icon: Award },
  product: { label: "Product", color: "bg-pink-500/15 text-pink-600", icon: BookOpen },
};

const typeConfig: Record<string, { label: string; icon: any }> = {
  live: { label: "Live Session", icon: Video },
  recorded: { label: "On-Demand", icon: Play },
  document: { label: "Reading", icon: FileText },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminTrainings() {
  const [trainings, setTrainings] = useState<Training[]>(mockTrainings);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || training.category === categoryFilter;
    const matchesType = typeFilter === "all" || training.type === typeFilter;
    const matchesTab = activeTab === "all" ||
      (activeTab === "mandatory" && training.is_mandatory) ||
      (activeTab === "upcoming" && training.status === "upcoming") ||
      (activeTab === "completed" && training.status === "completed");
    return matchesSearch && matchesCategory && matchesType && matchesTab;
  });

  const stats = {
    totalTrainings: trainings.length,
    mandatory: trainings.filter((t) => t.is_mandatory).length,
    completed: trainings.filter((t) => t.status === "completed").length,
    upcoming: trainings.filter((t) => t.status === "upcoming").length,
    avgRating: (
      trainings.filter((t) => t.rating > 0).reduce((acc, t) => acc + t.rating, 0) /
      trainings.filter((t) => t.rating > 0).length
    ).toFixed(1),
    totalHours: Math.round(trainings.reduce((acc, t) => acc + t.duration_minutes, 0) / 60),
  };

  const myProgress = {
    completed: 4,
    inProgress: 2,
    total: trainings.filter((t) => t.is_mandatory).length + 4,
    percentage: Math.round((4 / (trainings.filter((t) => t.is_mandatory).length + 4)) * 100),
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const formatScheduledDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const startTraining = (id: string) => {
    toast.success("Training started! Opening in new tab...");
    // Would open the training content
  };

  return (
    <>
      <Helmet>
        <title>Training Center | {siteConfig.name}</title>
      </Helmet>

      <motion.div
        className="py-6 lg:py-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-amber-600 text-white shadow-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              Training Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Enhance your skills and stay compliant with required trainings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Award className="h-4 w-4" />
              My Certificates
            </Button>
            <Button className="gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              Request Training
            </Button>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-amber-500/5 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Your Learning Progress</h3>
                      <p className="text-sm text-muted-foreground">Keep up the great work!</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-semibold text-foreground">{myProgress.completed} of {myProgress.total} completed</span>
                    </div>
                    <Progress value={myProgress.percentage} className="h-3" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 lg:gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{myProgress.completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{myProgress.inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.mandatory - 1}</p>
                    <p className="text-xs text-muted-foreground">Required</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Trainings", value: stats.totalTrainings, icon: BookOpen, color: "from-blue-500 to-blue-600" },
            { label: "Mandatory", value: stats.mandatory, icon: FileText, color: "from-red-500 to-red-600" },
            { label: "Upcoming Live", value: stats.upcoming, icon: Video, color: "from-purple-500 to-purple-600" },
            { label: "Avg Rating", value: stats.avgRating, icon: Star, color: "from-amber-500 to-amber-600" },
            { label: "Total Hours", value: `${stats.totalHours}h`, icon: Clock, color: "from-emerald-500 to-emerald-600" },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs & Filters */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Trainings</TabsTrigger>
              <TabsTrigger value="mandatory" className="gap-1">
                Mandatory
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                  {stats.mandatory}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Live</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trainings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-44">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="live">Live Session</SelectItem>
                    <SelectItem value="recorded">On-Demand</SelectItem>
                    <SelectItem value="document">Reading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Training Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTrainings.map((training, index) => {
              const CategoryIcon = categoryConfig[training.category]?.icon || BookOpen;
              const TypeIcon = typeConfig[training.type]?.icon || Play;

              return (
                <motion.div
                  key={training.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={`border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden h-full flex flex-col ${training.is_mandatory ? "ring-2 ring-red-500/30" : ""}`}>
                    {/* Thumbnail area */}
                    <div className="h-32 bg-gradient-to-br from-muted to-muted/50 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${
                          training.category === "sales" ? "from-blue-500 to-blue-600" :
                          training.category === "marketing" ? "from-purple-500 to-purple-600" :
                          training.category === "compliance" ? "from-red-500 to-red-600" :
                          training.category === "technology" ? "from-emerald-500 to-emerald-600" :
                          "from-amber-500 to-amber-600"
                        } shadow-lg`}>
                          <CategoryIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {training.is_mandatory && (
                          <Badge variant="destructive" className="text-[10px]">
                            Required
                          </Badge>
                        )}
                        {training.status === "upcoming" && (
                          <Badge className="bg-purple-500/90 text-white text-[10px]">
                            <Video className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-[10px]">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(training.duration_minutes)}
                        </Badge>
                      </div>

                      {training.completion_rate > 0 && training.completion_rate < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                          <div
                            className="h-full bg-accent"
                            style={{ width: `${training.completion_rate}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className={categoryConfig[training.category]?.color}>
                          {categoryConfig[training.category]?.label}
                        </Badge>
                        {training.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span className="font-medium">{training.rating}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {training.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {training.description}
                      </p>

                      <div className="space-y-3">
                        {training.scheduled_at && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatScheduledDate(training.scheduled_at)}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TypeIcon className="h-4 w-4" />
                            <span>{typeConfig[training.type]?.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{training.attendees} enrolled</span>
                          </div>
                        </div>

                        {training.resources.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {training.resources.map((resource, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] gap-1 cursor-pointer hover:bg-muted">
                                <Download className="h-3 w-3" />
                                {resource.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-border">
                          {training.status === "completed" ? (
                            <Button variant="outline" className="w-full gap-2" size="sm">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              Completed
                            </Button>
                          ) : training.status === "upcoming" ? (
                            <Button className="w-full gap-2" size="sm">
                              <Calendar className="h-4 w-4" />
                              Register
                            </Button>
                          ) : (
                            <Button
                              className="w-full gap-2"
                              size="sm"
                              onClick={() => startTraining(training.id)}
                            >
                              <Play className="h-4 w-4" />
                              {training.completion_rate > 0 ? "Continue" : "Start Training"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredTrainings.length === 0 && (
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No trainings found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </>
  );
}

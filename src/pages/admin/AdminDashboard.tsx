import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useRealtimeDashboard } from "@/hooks/useRealtimeData";
import { Link } from "react-router-dom";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Home,
  BarChart3,
  Activity,
  Clock,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Sparkles,
  Link2,
  Video,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Play,
  Pause,
  Building2,
  MapPin,
  Eye,
  MessageSquare,
  Bell,
  TrendingDown,
  Wallet,
  PieChart,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface DashboardStats {
  totalLeads: number;
  activeListings: number;
  monthlyRevenue: number;
  conversionRate: number;
  recentLeads: any[];
  topSources: { source: string; count: number }[];
  monthlyTrend: { month: string; leads: number; revenue: number }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Animated counter component
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

// Live pulse indicator
function LivePulse({ status }: { status: "online" | "syncing" | "error" }) {
  const colors = {
    online: "bg-emerald-500",
    syncing: "bg-amber-500",
    error: "bg-red-500",
  };
  
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status]}`} />
    </span>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    activeListings: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    recentLeads: [],
    topSources: [],
    monthlyTrend: [],
  });
  const [loading, setLoading] = useState(true);
  const [mlsStatus, setMlsStatus] = useState<"online" | "syncing" | "error">("online");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  // Enable realtime subscriptions for dashboard data
  useRealtimeDashboard();

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Simulate MLS sync
    const mlsTimer = setInterval(() => {
      setMlsStatus("syncing");
      setTimeout(() => setMlsStatus("online"), 2000);
    }, 30000);
    return () => clearInterval(mlsTimer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadsError) throw leadsError;

      const totalLeads = leads?.length || 0;
      const thisMonth = new Date();
      thisMonth.setDate(1);

      const monthlyLeads = leads?.filter((lead) => new Date(lead.created_at) >= thisMonth) || [];

      const dashboardStats: DashboardStats = {
        totalLeads,
        activeListings: 24,
        monthlyRevenue: 847500,
        conversionRate: totalLeads > 0 ? Math.round((monthlyLeads.length / totalLeads) * 100) : 24,
        recentLeads: leads?.slice(0, 5) || [],
        topSources: [
          { source: "Zillow", count: Math.floor(totalLeads * 0.35) || 12 },
          { source: "Realtor.com", count: Math.floor(totalLeads * 0.25) || 8 },
          { source: "Direct", count: Math.floor(totalLeads * 0.2) || 6 },
          { source: "Referral", count: Math.floor(totalLeads * 0.15) || 5 },
          { source: "Social", count: Math.floor(totalLeads * 0.05) || 2 },
        ],
        monthlyTrend: [
          { month: "Jan", leads: 12, revenue: 285 },
          { month: "Feb", leads: 19, revenue: 392 },
          { month: "Mar", leads: 15, revenue: 278 },
          { month: "Apr", leads: 25, revenue: 510 },
          { month: "May", leads: 22, revenue: 495 },
          { month: "Jun", leads: 28, revenue: 625 },
          { month: "Jul", leads: 24, revenue: 505 },
          { month: "Aug", leads: 30, revenue: 735 },
          { month: "Sep", leads: 27, revenue: 618 },
          { month: "Oct", leads: 32, revenue: 745 },
          { month: "Nov", leads: 29, revenue: 628 },
          { month: "Dec", leads: 35, revenue: 847 },
        ],
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for meetings and trainings
  const upcomingMeetings = [
    { id: 1, title: "Client Showing - Riverstone", time: "10:00 AM", client: "Sarah M.", type: "showing", property: "4521 Riverstone Blvd" },
    { id: 2, title: "Listing Presentation", time: "2:00 PM", client: "John & Lisa K.", type: "listing", property: "8234 Memorial Dr" },
    { id: 3, title: "Closing Meeting", time: "4:30 PM", client: "Michael R.", type: "closing", property: "1122 Sugar Land Ave" },
  ];

  const upcomingTrainings = [
    { id: 1, title: "eXp Realty Market Update", date: "Today", time: "11:00 AM", duration: "1 hr", mandatory: true },
    { id: 2, title: "New MLS Features Training", date: "Tomorrow", time: "9:00 AM", duration: "2 hrs", mandatory: false },
    { id: 3, title: "Luxury Marketing Strategies", date: "Jan 10", time: "3:00 PM", duration: "1.5 hrs", mandatory: false },
  ];

  const revenueBreakdown = [
    { name: "Listing Commission", value: 425000, color: "#C9A962" },
    { name: "Buyer Commission", value: 312500, color: "#10b981" },
    { name: "Referral Fees", value: 85000, color: "#3b82f6" },
    { name: "Other", value: 25000, color: "#8b5cf6" },
  ];

  const statCards = [
    {
      title: "Total Revenue",
      value: stats.monthlyRevenue,
      prefix: "$",
      change: "+18.2%",
      changeType: "positive" as const,
      icon: Wallet,
      description: "YTD earnings",
      gradient: "from-accent to-amber-600",
      bgGradient: "from-accent/10 to-amber-600/5",
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      prefix: "",
      change: "+3",
      changeType: "positive" as const,
      icon: Building2,
      description: "properties live",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/5",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads || 47,
      prefix: "",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "this month",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-600/5",
    },
    {
      title: "Conversion Rate",
      value: stats.conversionRate || 24,
      prefix: "",
      suffix: "%",
      change: "+2.4%",
      changeType: "positive" as const,
      icon: Target,
      description: "lead to client",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-600/5",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <motion.div
              className="w-16 h-16 border-4 border-muted rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-muted-foreground font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | {siteConfig.name}</title>
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)]">
        <motion.div
          className="py-6 lg:py-8 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-amber-600 text-white shadow-lg shadow-accent/25"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
                    Command Center
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Real-time business intelligence
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Live Clock */}
              <motion.div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/50 shadow-sm"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="h-4 w-4 text-accent" />
                <span className="font-mono text-sm font-medium">
                  {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </motion.div>

              {/* MLS Status */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/50 shadow-sm">
                <LivePulse status={mlsStatus} />
                <span className="text-sm font-medium">
                  MLS {mlsStatus === "syncing" ? "Syncing..." : "Connected"}
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5">eXp</Badge>
              </div>

              {/* Date */}
              <Badge
                variant="outline"
                className="px-4 py-2.5 bg-card border-border/50 text-sm"
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:shadow-xl transition-shadow`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground tracking-tight">
                          <AnimatedCounter 
                            value={stat.value} 
                            prefix={stat.prefix} 
                            suffix={stat.suffix}
                          />
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                            stat.changeType === "positive"
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-red-500/15 text-red-500"
                          }`}>
                            {stat.changeType === "positive" ? (
                              <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            )}
                            {stat.change}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {stat.description}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                        whileHover={{ rotate: 10 }}
                      >
                        <stat.icon className="h-5 w-5 text-white" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6">
              {/* Revenue Chart */}
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        Revenue & Performance
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Monthly revenue trends (in thousands)
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span className="text-muted-foreground">Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">Leads</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlyTrend}>
                        <defs>
                          <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorLeads2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue2)" />
                        <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-accent" />
                      Revenue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={revenueBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {revenueBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {revenueBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Sources */}
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      Lead Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topSources.map((source, index) => (
                        <motion.div
                          key={source.source}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-1.5"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{source.source}</span>
                            <span className="font-semibold">{source.count}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(source.count / (stats.topSources[0]?.count || 1)) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-accent to-amber-500 rounded-full"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Right Column - Meetings, Trainings, Activity */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* MLS Integration Status */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <CardContent className="relative p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                        <Link2 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">eXp Realty MLS</p>
                        <p className="text-xs text-white/60">Houston Association</p>
                      </div>
                    </div>
                    <LivePulse status={mlsStatus} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <p className="text-xl font-bold">24</p>
                      <p className="text-[10px] text-white/60 uppercase">Active</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <p className="text-xl font-bold">8</p>
                      <p className="text-[10px] text-white/60 uppercase">Pending</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <p className="text-xl font-bold">156</p>
                      <p className="text-[10px] text-white/60 uppercase">Sold YTD</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Last sync: 2 min ago</span>
                    <Button size="sm" variant="ghost" className="h-7 text-white/80 hover:text-white hover:bg-white/10">
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Sync Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-accent" />
                      Today's Schedule
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">{upcomingMeetings.length} meetings</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingMeetings.map((meeting, index) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-xl bg-muted/50 border border-border/50 hover:border-accent/30 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm group-hover:text-accent transition-colors">{meeting.title}</p>
                          <p className="text-xs text-muted-foreground">{meeting.client}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{meeting.time}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{meeting.property}</span>
                      </div>
                    </motion.div>
                  ))}
                  <Link to="/admin/showings">
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-accent">
                      View All Appointments
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Trainings */}
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-accent" />
                      Trainings
                    </CardTitle>
                    <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">eXp University</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingTrainings.map((training, index) => (
                    <motion.div
                      key={training.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-xl bg-muted/50 border border-border/50 hover:border-accent/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                              {training.title}
                            </p>
                            {training.mandatory && (
                              <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Required</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {training.date} • {training.time} • {training.duration}
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                          <Video className="h-4 w-4 text-accent" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Mail, label: "Send Email", color: "bg-blue-500" },
                    { icon: Phone, label: "Log Call", color: "bg-emerald-500" },
                    { icon: Calendar, label: "Schedule", color: "bg-amber-500" },
                    { icon: FileText, label: "New Lead", color: "bg-purple-500" },
                  ].map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-accent/30 transition-all"
                    >
                      <div className={`p-1.5 rounded-lg ${action.color}`}>
                        <action.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity / Leads */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-accent" />
                      Recent Leads
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Latest inquiries and activities</p>
                  </div>
                  <Link to="/admin/leads">
                    <Button variant="outline" size="sm" className="gap-1">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {stats.recentLeads.length > 0 ? (
                    stats.recentLeads.slice(0, 6).map((lead, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-accent to-amber-600 text-white font-semibold text-sm">
                              {lead.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm group-hover:text-accent transition-colors truncate">
                              {lead.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-[10px]">
                                {lead.lead_source || "Website"}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No leads yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Your new leads will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default AdminDashboard;
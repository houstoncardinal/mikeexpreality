import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";
import { motion } from "framer-motion";
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
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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

  useEffect(() => {
    fetchDashboardData();
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

      const monthlyLeads =
        leads?.filter((lead) => new Date(lead.created_at) >= thisMonth) || [];

      const dashboardStats: DashboardStats = {
        totalLeads,
        activeListings: 24,
        monthlyRevenue: 125000,
        conversionRate:
          totalLeads > 0
            ? Math.round((monthlyLeads.length / totalLeads) * 100)
            : 0,
        recentLeads: leads?.slice(0, 5) || [],
        topSources: [
          { source: "Contact Form", count: Math.floor(totalLeads * 0.4) || 8 },
          { source: "Phone Call", count: Math.floor(totalLeads * 0.3) || 6 },
          { source: "Email", count: Math.floor(totalLeads * 0.2) || 4 },
          { source: "Website", count: Math.floor(totalLeads * 0.1) || 2 },
        ],
        monthlyTrend: [
          { month: "Jan", leads: 12, revenue: 85 },
          { month: "Feb", leads: 19, revenue: 92 },
          { month: "Mar", leads: 15, revenue: 78 },
          { month: "Apr", leads: 25, revenue: 110 },
          { month: "May", leads: 22, revenue: 95 },
          { month: "Jun", leads: 28, revenue: 125 },
          { month: "Jul", leads: 24, revenue: 105 },
          { month: "Aug", leads: 30, revenue: 135 },
          { month: "Sep", leads: 27, revenue: 118 },
          { month: "Oct", leads: 32, revenue: 145 },
          { month: "Nov", leads: 29, revenue: 128 },
          { month: "Dec", leads: 35, revenue: 155 },
        ],
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "vs last month",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      title: "Active Listings",
      value: stats.activeListings.toString(),
      change: "+3",
      changeType: "positive" as const,
      icon: Home,
      description: "properties live",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/5",
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "commission earned",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/5",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate || 24}%`,
      change: "-2%",
      changeType: "negative" as const,
      icon: Target,
      description: "lead to client",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/5",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-muted rounded-full" />
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | {siteConfig.name}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          className="p-6 lg:p-8 space-y-8"
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
                <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
                  Welcome back, {siteConfig.agent.name.split(" ")[0]}
                </h1>
              </div>
              <p className="text-muted-foreground">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="px-4 py-2 bg-background/80 backdrop-blur-sm border-border/50"
              >
                <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </Badge>
              <Button size="sm" className="gap-2">
                <Activity className="h-4 w-4" />
                View Reports
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-16 translate-x-16`}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground tracking-tight">
                          {stat.value}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                              stat.changeType === "positive"
                                ? "bg-emerald-500/15 text-emerald-600"
                                : "bg-red-500/15 text-red-500"
                            }`}
                          >
                            {stat.changeType === "positive" ? (
                              <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            )}
                            {stat.change}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {stat.description}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                      >
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            {/* Area Chart */}
            <Card className="xl:col-span-2 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Lead & Revenue Trend
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monthly performance overview
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      <span className="text-muted-foreground">Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Revenue</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyTrend}>
                      <defs>
                        <linearGradient
                          id="colorLeads"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--accent))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--accent))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorLeads)"
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Lead Sources Bar Chart */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Lead Sources
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Where your leads come from
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topSources}
                      layout="vertical"
                      margin={{ left: 0, right: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="source"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--accent))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Recent Leads */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-accent" />
                      Recent Leads
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your latest inquiries
                    </p>
                  </div>
                  <Link to="/admin/leads">
                    <Button variant="ghost" size="sm" className="gap-1 text-accent">
                      View all
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentLeads.length > 0 ? (
                    stats.recentLeads.map((lead, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent/30 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg">
                            <span className="text-accent-foreground font-semibold text-sm">
                              {lead.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {lead.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lead.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="secondary"
                            className="mb-1.5 text-xs font-medium"
                          >
                            {lead.lead_source || "Website"}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No leads yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your new leads will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { icon: Mail, label: "Send Follow-up Email", color: "text-blue-500" },
                    { icon: Phone, label: "Schedule Call", color: "text-emerald-500" },
                    { icon: Calendar, label: "Book Showing", color: "text-amber-500" },
                    { icon: Target, label: "Create Campaign", color: "text-purple-500" },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-11 hover:bg-muted/80"
                    >
                      <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {[
                      {
                        label: "Response Time",
                        value: "2.3 hrs",
                        progress: 85,
                        color: "bg-blue-500",
                      },
                      {
                        label: "Client Satisfaction",
                        value: "4.8/5",
                        progress: 96,
                        color: "bg-emerald-500",
                      },
                      {
                        label: "Lead Quality",
                        value: "High",
                        progress: 78,
                        color: "bg-amber-500",
                      },
                    ].map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {metric.label}
                          </span>
                          <span className="font-semibold text-foreground">
                            {metric.value}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className={`h-full ${metric.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default AdminDashboard;

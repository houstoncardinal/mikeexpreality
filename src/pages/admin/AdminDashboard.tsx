import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format, subDays, startOfDay, eachDayOfInterval, differenceInDays } from "date-fns";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Target,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Eye,
  MessageSquare,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Bell,
  Settings,
  ChevronRight,
  Building2,
  Home
} from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from "recharts";

interface Stats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
}

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  status: string | null;
  lead_source: string | null;
  property_address: string | null;
  message: string | null;
}

const COLORS = [
  "hsl(220, 75%, 55%)", 
  "hsl(160, 60%, 45%)", 
  "hsl(42, 85%, 55%)", 
  "hsl(350, 70%, 55%)", 
  "hsl(280, 65%, 55%)",
  "hsl(190, 70%, 45%)"
];

const STATUS_COLORS = {
  new: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  contacted: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  converted: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  lost: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-300", dot: "bg-rose-500" },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
  });
  const [recentLeads, setRecentLeads] = useState<LeadData[]>([]);
  const [leadTrendData, setLeadTrendData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [conversionFunnelData, setConversionFunnelData] = useState<any[]>([]);
  const [weeklyComparisonData, setWeeklyComparisonData] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "14d" | "30d" | "90d">("14d");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchRecentLeads(),
      fetchLeadTrends(),
      fetchRecentPosts(),
    ]);
    setLoading(false);
    setLastRefresh(new Date());
  };

  const fetchStats = async () => {
    const [
      { count: totalLeads },
      { count: newLeads },
      { count: contactedLeads },
      { count: convertedLeads },
      { count: publishedPosts },
      { count: draftPosts },
      { count: totalCategories },
    ] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "contacted"),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "converted"),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", false),
      supabase.from("blog_categories").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      totalLeads: totalLeads || 0,
      newLeads: newLeads || 0,
      contactedLeads: contactedLeads || 0,
      convertedLeads: convertedLeads || 0,
      publishedPosts: publishedPosts || 0,
      draftPosts: draftPosts || 0,
      totalCategories: totalCategories || 0,
    });

    // Conversion funnel data
    setConversionFunnelData([
      { stage: "New Leads", value: newLeads || 0, fill: COLORS[0] },
      { stage: "Contacted", value: contactedLeads || 0, fill: COLORS[1] },
      { stage: "Converted", value: convertedLeads || 0, fill: COLORS[2] },
    ]);
  };

  const fetchRecentLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    setRecentLeads(data || []);
  };

  const fetchRecentPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, is_published, created_at, read_time")
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentPosts(data || []);
  };

  const fetchLeadTrends = async () => {
    const daysMap = { "7d": 7, "14d": 14, "30d": 30, "90d": 90 };
    const days = daysMap[dateRange];
    const startDate = subDays(new Date(), days);
    
    const { data } = await supabase
      .from("leads")
      .select("created_at, status, lead_source")
      .gte("created_at", startDate.toISOString());

    // Process lead trends
    const dateInterval = eachDayOfInterval({
      start: startDate,
      end: new Date(),
    });

    const trendData = dateInterval.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayLeads = (data || []).filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate >= dayStart && leadDate < dayEnd;
      });

      return {
        date: format(day, days > 14 ? "MMM d" : "EEE"),
        fullDate: format(day, "MMM d, yyyy"),
        leads: dayLeads.length,
        converted: dayLeads.filter(l => l.status === "converted").length,
        contacted: dayLeads.filter(l => l.status === "contacted").length,
      };
    });

    setLeadTrendData(trendData);

    // Process source breakdown
    const sources: Record<string, number> = {};
    (data || []).forEach(lead => {
      const source = lead.lead_source || "Website";
      sources[source] = (sources[source] || 0) + 1;
    });

    setSourceData(
      Object.entries(sources)
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }))
        .sort((a, b) => b.value - a.value)
    );

    // Weekly comparison
    const thisWeek = (data || []).filter(l => 
      differenceInDays(new Date(), new Date(l.created_at)) <= 7
    ).length;
    const lastWeek = (data || []).filter(l => {
      const diff = differenceInDays(new Date(), new Date(l.created_at));
      return diff > 7 && diff <= 14;
    }).length;

    setWeeklyComparisonData([
      { name: "This Week", value: thisWeek },
      { name: "Last Week", value: lastWeek },
    ]);
  };

  const conversionRate = stats.totalLeads > 0 
    ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) 
    : 0;

  const responseRate = stats.totalLeads > 0 
    ? Math.round(((stats.contactedLeads + stats.convertedLeads) / stats.totalLeads) * 100) 
    : 0;

  const getStatusColor = (status: string | null) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.new;
  };

  const getTimeAgo = (dateString: string) => {
    const diff = differenceInDays(new Date(), new Date(dateString));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  return (
    <>
      <Helmet>
        <title>Enterprise Dashboard | Houston Elite Real Estate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
                <Activity className="h-8 w-8 text-accent" />
                Command Center
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last updated: {format(lastRefresh, "h:mm a")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                {(["7d", "14d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      dateRange === range
                        ? "bg-accent text-accent-foreground"
                        : "bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchAllData}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/admin/leads">
              <Card className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">View Leads</p>
                    <p className="text-xs text-muted-foreground">{stats.newLeads} new</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </Card>
            </Link>
            <Link to="/admin/posts/new">
              <Card className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">New Post</p>
                    <p className="text-xs text-muted-foreground">Create content</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </Card>
            </Link>
            <Link to="/admin/categories">
              <Card className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Categories</p>
                    <p className="text-xs text-muted-foreground">{stats.totalCategories} total</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </Card>
            </Link>
            <Link to="/admin/posts">
              <Card className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">All Posts</p>
                    <p className="text-xs text-muted-foreground">{stats.publishedPosts} live</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </Card>
            </Link>
          </div>

          {/* Primary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                  <p className="text-4xl font-bold text-foreground mt-2">{stats.totalLeads}</p>
                  <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">All time</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                  <p className="text-4xl font-bold text-foreground mt-2">{stats.newLeads}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      Awaiting Contact
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-4xl font-bold text-foreground mt-2">{conversionRate}%</p>
                  <div className="flex items-center gap-1 mt-2 text-emerald-600 dark:text-emerald-400">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">{stats.convertedLeads} converted</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/50 dark:border-purple-800/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Content Published</p>
                  <p className="text-4xl font-bold text-foreground mt-2">{stats.publishedPosts}</p>
                  <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{stats.draftPosts} drafts</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lead Trends Chart */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">Lead Acquisition Trends</h2>
                  <p className="text-sm text-muted-foreground">Track lead flow and conversion over time</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">New Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Converted</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={leadTrendData}>
                    <defs>
                      <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(220, 75%, 55%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(220, 75%, 55%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                      }}
                      labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="hsl(220, 75%, 55%)" 
                      strokeWidth={2}
                      fill="url(#leadGradient)" 
                      name="Total Leads"
                    />
                    <Bar 
                      dataKey="converted" 
                      fill="hsl(160, 60%, 45%)" 
                      radius={[4, 4, 0, 0]}
                      name="Converted"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Conversion Funnel */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="font-serif text-xl font-bold text-foreground">Sales Funnel</h2>
                <p className="text-sm text-muted-foreground">Lead progression through stages</p>
              </div>
              
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => {
                  const maxValue = Math.max(...conversionFunnelData.map(s => s.value), 1);
                  const percentage = (stage.value / maxValue) * 100;
                  
                  return (
                    <div key={stage.stage}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                        <span className="text-sm font-bold text-foreground">{stage.value}</span>
                      </div>
                      <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                        <div 
                          className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ 
                            width: `${Math.max(percentage, 10)}%`,
                            backgroundColor: stage.fill
                          }}
                        >
                          {percentage > 20 && (
                            <span className="text-xs font-medium text-white">
                              {Math.round(percentage)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Response Rate</span>
                  <span className="text-2xl font-bold text-foreground">{responseRate}%</span>
                </div>
                <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${responseRate}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">Lead Sources</h2>
                  <p className="text-sm text-muted-foreground">Where your leads originate</p>
                </div>
                <PieChartIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              {sourceData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No lead data yet</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-8">
                  <div className="h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {sourceData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {sourceData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm text-foreground">{entry.name}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Recent Blog Posts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">Recent Content</h2>
                  <p className="text-sm text-muted-foreground">Latest blog posts</p>
                </div>
                <Link to="/admin/posts">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              {recentPosts.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No posts yet</p>
                    <Link to="/admin/posts/new">
                      <Button variant="outline" size="sm" className="mt-3">
                        Create First Post
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPosts.map((post) => (
                    <Link 
                      key={post.id} 
                      to={`/admin/posts/${post.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                          <span>•</span>
                          <span>{post.read_time || 5} min read</span>
                        </div>
                      </div>
                      <Badge 
                        variant={post.is_published ? "default" : "secondary"}
                        className={post.is_published ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : ""}
                      >
                        {post.is_published ? "Live" : "Draft"}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Recent Leads Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">Recent Leads</h2>
                <p className="text-sm text-muted-foreground">Latest inquiries and their status</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/leads">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </Link>
                <Link to="/admin/leads">
                  <Button size="sm" className="gap-2">
                    View All Leads
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {recentLeads.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium text-foreground mb-2">No leads yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  When visitors submit contact forms, their information will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Contact</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Source</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Property Interest</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => {
                      const statusColors = getStatusColor(lead.status);
                      return (
                        <tr 
                          key={lead.id} 
                          className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-foreground">{lead.name}</p>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {lead.email}
                                </span>
                                {lead.phone && (
                                  <span className="flex items-center gap-1 hidden md:flex">
                                    <Phone className="h-3 w-3" />
                                    {lead.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="capitalize">
                              {lead.lead_source || "website"}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 hidden lg:table-cell">
                            {lead.property_address ? (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {lead.property_address}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">General inquiry</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                              {(lead.status || "new").charAt(0).toUpperCase() + (lead.status || "new").slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-muted-foreground">
                              {getTimeAgo(lead.created_at)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Performance Metrics Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{stats.totalCategories}</p>
              <p className="text-sm text-muted-foreground mt-1">Blog Categories</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{stats.draftPosts}</p>
              <p className="text-sm text-muted-foreground mt-1">Draft Posts</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{stats.contactedLeads}</p>
              <p className="text-sm text-muted-foreground mt-1">Leads Contacted</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">{responseRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">Response Rate</p>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;

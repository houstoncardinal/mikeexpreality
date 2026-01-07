import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Home,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
  Legend,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Mock data
const revenueData = [
  { month: "Jan", revenue: 285000, deals: 3, leads: 45 },
  { month: "Feb", revenue: 392000, deals: 4, leads: 52 },
  { month: "Mar", revenue: 278000, deals: 3, leads: 38 },
  { month: "Apr", revenue: 510000, deals: 5, leads: 61 },
  { month: "May", revenue: 495000, deals: 5, leads: 58 },
  { month: "Jun", revenue: 625000, deals: 6, leads: 72 },
  { month: "Jul", revenue: 505000, deals: 5, leads: 55 },
  { month: "Aug", revenue: 735000, deals: 7, leads: 84 },
  { month: "Sep", revenue: 618000, deals: 6, leads: 67 },
  { month: "Oct", revenue: 745000, deals: 7, leads: 79 },
  { month: "Nov", revenue: 628000, deals: 6, leads: 71 },
  { month: "Dec", revenue: 847000, deals: 8, leads: 92 },
];

const leadSourceData = [
  { name: "Zillow", value: 35, color: "#3b82f6" },
  { name: "Realtor.com", value: 25, color: "#10b981" },
  { name: "Referrals", value: 20, color: "#f59e0b" },
  { name: "Website", value: 12, color: "#8b5cf6" },
  { name: "Social Media", value: 8, color: "#ec4899" },
];

const propertyTypeData = [
  { type: "Single Family", count: 45, volume: 28500000 },
  { type: "Condo", count: 23, volume: 9200000 },
  { type: "Townhouse", count: 18, volume: 8100000 },
  { type: "Multi-Family", count: 8, volume: 12400000 },
  { type: "Land", count: 6, volume: 2800000 },
];

const agentPerformance = [
  { name: "Mike Johnson", deals: 28, volume: 18500000, conversion: 34, rating: 4.9 },
  { name: "Sarah Chen", deals: 24, volume: 15200000, conversion: 31, rating: 4.8 },
  { name: "David Kim", deals: 21, volume: 12800000, conversion: 28, rating: 4.7 },
  { name: "Lisa Martinez", deals: 18, volume: 11200000, conversion: 26, rating: 4.8 },
  { name: "James Wilson", deals: 15, volume: 9500000, conversion: 24, rating: 4.6 },
];

const weeklyActivity = [
  { day: "Mon", showings: 8, calls: 24, emails: 45 },
  { day: "Tue", showings: 12, calls: 32, emails: 52 },
  { day: "Wed", showings: 10, calls: 28, emails: 48 },
  { day: "Thu", showings: 15, calls: 35, emails: 58 },
  { day: "Fri", showings: 18, calls: 40, emails: 62 },
  { day: "Sat", showings: 22, calls: 15, emails: 28 },
  { day: "Sun", showings: 8, calls: 8, emails: 15 },
];

export default function AdminReports() {
  const [dateRange, setDateRange] = useState("ytd");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
    toast.success("Reports refreshed");
  };

  const handleExport = (reportType: string) => {
    toast.success(`Exporting ${reportType} report...`);
  };

  const totalRevenue = revenueData.reduce((acc, d) => acc + d.revenue, 0);
  const totalDeals = revenueData.reduce((acc, d) => acc + d.deals, 0);
  const totalLeads = revenueData.reduce((acc, d) => acc + d.leads, 0);
  const avgDealSize = totalRevenue / totalDeals;
  const conversionRate = Math.round((totalDeals / totalLeads) * 100);

  const kpis = [
    {
      title: "Total Revenue",
      value: `$${(totalRevenue / 1000000).toFixed(2)}M`,
      change: "+18.2%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-accent to-amber-600",
    },
    {
      title: "Closed Deals",
      value: totalDeals,
      change: "+12",
      changeType: "positive",
      icon: Home,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Total Leads",
      value: totalLeads,
      change: "+23%",
      changeType: "positive",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      change: "+2.4%",
      changeType: "positive",
      icon: Target,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Avg Deal Size",
      value: `$${Math.round(avgDealSize / 1000)}K`,
      change: "+8%",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Reports & Analytics | {siteConfig.name}</title>
      </Helmet>

      <AdminLayout>
        <motion.div
          className="p-6 lg:p-8 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-amber-600 text-white shadow-lg">
                  <BarChart3 className="h-5 w-5" />
                </div>
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive business intelligence and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button className="gap-2" onClick={() => handleExport("full")}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, i) => (
              <motion.div key={i} whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                        <kpi.icon className="h-4 w-4 text-white" />
                      </div>
                      <Badge className={kpi.changeType === "positive" ? "bg-emerald-500/15 text-emerald-600" : "bg-red-500/15 text-red-600"}>
                        {kpi.changeType === "positive" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                        {kpi.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <motion.div variants={itemVariants} className="xl:col-span-2">
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        Revenue & Deals Trend
                      </CardTitle>
                      <CardDescription>Monthly performance overview</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExport("revenue")}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis
                          className="text-xs"
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                          tickFormatter={(v) => `$${v / 1000}K`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, "Revenue"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--accent))"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lead Sources */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-accent" />
                    Lead Sources
                  </CardTitle>
                  <CardDescription>Where your leads come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={leadSourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {leadSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value}%`, "Share"]}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {leadSourceData.map((source, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                          <span className="text-muted-foreground">{source.name}</span>
                        </div>
                        <span className="font-medium">{source.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Weekly Activity */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>Team activity breakdown by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="showings" fill="#C9A962" name="Showings" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="calls" fill="#3b82f6" name="Calls" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="emails" fill="#10b981" name="Emails" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Property Types */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="h-5 w-5 text-accent" />
                    Sales by Property Type
                  </CardTitle>
                  <CardDescription>Volume and count breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {propertyTypeData.map((type, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{type.type}</span>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span>{type.count} sold</span>
                            <span className="font-medium text-foreground">
                              ${(type.volume / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={(type.volume / propertyTypeData[0].volume) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Agent Performance */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      Agent Performance
                    </CardTitle>
                    <CardDescription>Top performing agents this period</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleExport("agents")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Agent</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Deals</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Volume</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Conversion</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Rating</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentPerformance.map((agent, i) => (
                        <motion.tr
                          key={i}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {agent.name.split(" ").map((n) => n[0]).join("")}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{agent.name}</p>
                                <p className="text-xs text-muted-foreground">Senior Agent</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-semibold text-foreground">{agent.deals}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-semibold text-emerald-600">
                              ${(agent.volume / 1000000).toFixed(1)}M
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge className="bg-blue-500/15 text-blue-600">{agent.conversion}%</Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-amber-500">★</span>
                              <span className="font-medium">{agent.rating}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center">
                              <Progress
                                value={(agent.deals / agentPerformance[0].deals) * 100}
                                className="w-24 h-2"
                              />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminLayout>
    </>
  );
}

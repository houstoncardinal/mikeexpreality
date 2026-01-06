import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, TrendingUp, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
} from "recharts";

interface Stats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  publishedPosts: number;
}

interface LeadData {
  created_at: string;
  status: string | null;
  lead_source: string | null;
}

const COLORS = ["hsl(220, 75%, 55%)", "hsl(160, 60%, 45%)", "hsl(42, 85%, 55%)", "hsl(350, 70%, 55%)", "hsl(220, 15%, 65%)"];

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    convertedLeads: 0,
    publishedPosts: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [leadTrendData, setLeadTrendData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentLeads();
    fetchLeadTrends();
  }, []);

  const fetchStats = async () => {
    const { count: totalLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    const { count: newLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    const { count: convertedLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "converted");

    const { count: publishedPosts } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    setStats({
      totalLeads: totalLeads || 0,
      newLeads: newLeads || 0,
      convertedLeads: convertedLeads || 0,
      publishedPosts: publishedPosts || 0,
    });

    // Set conversion data for pie chart
    const contacted = (totalLeads || 0) - (newLeads || 0) - (convertedLeads || 0);
    setConversionData([
      { name: "New", value: newLeads || 0 },
      { name: "Contacted", value: Math.max(0, contacted) },
      { name: "Converted", value: convertedLeads || 0 },
    ].filter(d => d.value > 0));
  };

  const fetchRecentLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentLeads(data || []);
  };

  const fetchLeadTrends = async () => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    
    const { data } = await supabase
      .from("leads")
      .select("created_at, status, lead_source")
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (!data) {
      // Generate sample trend data if no leads
      const days = eachDayOfInterval({
        start: subDays(new Date(), 13),
        end: new Date(),
      });
      setLeadTrendData(days.map(day => ({
        date: format(day, "MMM d"),
        leads: 0,
        converted: 0,
      })));
      return;
    }

    // Process lead trends (last 14 days)
    const days = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date(),
    });

    const trendData = days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayLeads = data.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate >= dayStart && leadDate < dayEnd;
      });

      const converted = dayLeads.filter(lead => lead.status === "converted").length;

      return {
        date: format(day, "MMM d"),
        leads: dayLeads.length,
        converted,
      };
    });

    setLeadTrendData(trendData);

    // Process source breakdown
    const sources: Record<string, number> = {};
    data.forEach(lead => {
      const source = lead.lead_source || "website";
      sources[source] = (sources[source] || 0) + 1;
    });

    setSourceData(
      Object.entries(sources).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    );
  };

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      color: "bg-accent",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      icon: TrendingUp,
      color: "bg-emerald-500",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Converted",
      value: stats.convertedLeads,
      icon: CheckCircle,
      color: "bg-gold",
      trend: stats.totalLeads > 0 ? `${Math.round((stats.convertedLeads / stats.totalLeads) * 100)}%` : "0%",
      trendUp: true,
    },
    {
      title: "Blog Posts",
      value: stats.publishedPosts,
      icon: FileText,
      color: "bg-rose-500",
      trend: "Active",
      trendUp: true,
    },
  ];

  const conversionRate = stats.totalLeads > 0 
    ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) 
    : 0;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Houston Elite Real Estate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's an overview of your business.
              </p>
            </div>
            <Link to="/admin/leads">
              <button className="text-sm text-accent hover:underline flex items-center gap-1">
                View all leads <ArrowUpRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {stat.trend}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lead Trends Chart */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">Lead Trends</h2>
                  <p className="text-sm text-muted-foreground">New leads over the last 14 days</p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leadTrendData}>
                    <defs>
                      <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(220, 75%, 55%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(220, 75%, 55%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="convertedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(220, 15%, 45%)', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(220, 15%, 45%)', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(220, 20%, 88%)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="hsl(220, 75%, 55%)" 
                      strokeWidth={2}
                      fill="url(#leadGradient)" 
                      name="Total Leads"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="converted" 
                      stroke="hsl(160, 60%, 45%)" 
                      strokeWidth={2}
                      fill="url(#convertedGradient)" 
                      name="Converted"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Lead Sources */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="font-serif text-xl font-bold text-foreground">Lead Sources</h2>
                <p className="text-sm text-muted-foreground">Where your leads come from</p>
              </div>
              {sourceData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data yet
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sourceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(0, 0%, 100%)',
                          border: '1px solid hsl(220, 20%, 88%)',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 -mt-4">
                    {sourceData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-muted-foreground">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Conversion Funnel & Recent Leads */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Conversion Rate Card */}
            <Card className="p-6">
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">Conversion Rate</h2>
              <p className="text-sm text-muted-foreground mb-6">Overall lead to customer conversion</p>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="hsl(220, 15%, 92%)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="hsl(160, 60%, 45%)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${conversionRate * 4.4} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">{conversionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {conversionData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Leads Table */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Recent Leads
                </h2>
                <Link to="/admin/leads" className="text-sm text-accent hover:underline">
                  View all
                </Link>
              </div>
              {recentLeads.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No leads yet. They'll appear here when someone submits a form.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Source
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 px-4 text-sm text-foreground font-medium">{lead.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {lead.email}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground capitalize">
                            {lead.lead_source || "website"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                lead.status === "converted"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : lead.status === "contacted"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {lead.status || "new"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;

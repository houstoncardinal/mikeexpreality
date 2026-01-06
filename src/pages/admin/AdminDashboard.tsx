import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Eye,
  Home,
  BarChart3,
  Activity,
  Clock,
  Target,
  Award,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";

interface DashboardStats {
  totalLeads: number;
  activeListings: number;
  monthlyRevenue: number;
  conversionRate: number;
  recentLeads: any[];
  topSources: { source: string; count: number }[];
  monthlyTrend: number[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    activeListings: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    recentLeads: [],
    topSources: [],
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch leads data
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Calculate stats
      const totalLeads = leads?.length || 0;
      const thisMonth = new Date();
      thisMonth.setDate(1);

      const monthlyLeads = leads?.filter(lead =>
        new Date(lead.created_at) >= thisMonth
      ) || [];

      // Mock data for demonstration (replace with real calculations)
      const dashboardStats: DashboardStats = {
        totalLeads,
        activeListings: 24, // Mock data
        monthlyRevenue: 125000, // Mock data
        conversionRate: totalLeads > 0 ? Math.round((monthlyLeads.length / totalLeads) * 100) : 0,
        recentLeads: leads?.slice(0, 5) || [],
        topSources: [
          { source: 'Contact Form', count: Math.floor(totalLeads * 0.4) },
          { source: 'Phone Call', count: Math.floor(totalLeads * 0.3) },
          { source: 'Email', count: Math.floor(totalLeads * 0.2) },
          { source: 'Website', count: Math.floor(totalLeads * 0.1) },
        ],
        monthlyTrend: [12, 19, 15, 25, 22, 28, 24, 30, 27, 32, 29, 35] // Mock trend data
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      description: "This month"
    },
    {
      title: "Active Listings",
      value: stats.activeListings.toString(),
      change: "+3",
      changeType: "positive" as const,
      icon: Home,
      description: "Currently listed"
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Commission earned"
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      change: "+5%",
      changeType: "positive" as const,
      icon: Target,
      description: "Lead to client"
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | {siteConfig.name}</title>
      </Helmet>

      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {siteConfig.agent.name}. Here's your business overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Leads */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Leads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentLeads.map((lead, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1">
                            {lead.lead_source}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Leads
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Lead Sources & Performance */}
            <div className="space-y-6">
              {/* Lead Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Lead Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{source.source}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(source.count / stats.totalLeads) * 100} className="w-16 h-2" />
                          <span className="text-sm font-medium">{source.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Follow-up Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Showing
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span className="font-medium">2.3 hrs</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Client Satisfaction</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Lead Quality</span>
                        <span className="font-medium">High</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Monthly Trend Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Lead Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive chart coming soon</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced analytics dashboard with MLS integration
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
}

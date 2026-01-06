import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, TrendingUp, CheckCircle } from "lucide-react";

interface Stats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  publishedPosts: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    convertedLeads: 0,
    publishedPosts: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentLeads();
  }, []);

  const fetchStats = async () => {
    // Fetch total leads
    const { count: totalLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    // Fetch new leads
    const { count: newLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    // Fetch converted leads
    const { count: convertedLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "converted");

    // Fetch published posts
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
  };

  const fetchRecentLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentLeads(data || []);
  };

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      color: "bg-accent",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      icon: TrendingUp,
      color: "bg-emerald-500",
    },
    {
      title: "Converted",
      value: stats.convertedLeads,
      icon: CheckCircle,
      color: "bg-gold",
    },
    {
      title: "Blog Posts",
      value: stats.publishedPosts,
      icon: FileText,
      color: "bg-rose-500",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Houston Elite Real Estate</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your business.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Leads */}
          <Card className="p-6">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">
              Recent Leads
            </h2>
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
                      <tr key={lead.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-sm text-foreground">{lead.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {lead.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground capitalize">
                          {lead.lead_source}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
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
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;

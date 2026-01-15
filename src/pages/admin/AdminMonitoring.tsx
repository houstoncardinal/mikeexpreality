import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Globe,
  Webhook,
  TrendingUp,
  Server,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
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

interface HealthCheckLog {
  id: string;
  overall_status: string;
  results: Array<{
    name: string;
    status: string;
    latency?: number;
    message?: string;
  }>;
  email_sent: boolean;
  triggered_by: string;
  created_at: string;
}

interface HealthIncident {
  id: string;
  service_name: string;
  status: string;
  message: string | null;
  latency: number | null;
  resolved_at: string | null;
  created_at: string;
}

interface WebhookLog {
  id: string;
  event_type: string;
  payload: Record<string, unknown>;
  property_id: string | null;
  sitemap_regenerated: boolean;
  source_ip: string | null;
  created_at: string;
}

const COLORS = {
  healthy: "#10B981",
  degraded: "#F59E0B",
  unhealthy: "#EF4444",
};

export default function AdminMonitoring() {
  const { toast } = useToast();
  const [healthLogs, setHealthLogs] = useState<HealthCheckLog[]>([]);
  const [incidents, setIncidents] = useState<HealthIncident[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mls-webhook`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [logsResult, incidentsResult, webhooksResult] = await Promise.all([
        supabase
          .from("health_check_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("health_incidents")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("mls_webhook_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (logsResult.data) {
        setHealthLogs(logsResult.data as unknown as HealthCheckLog[]);
      }
      if (incidentsResult.data) {
        setIncidents(incidentsResult.data as HealthIncident[]);
      }
      if (webhooksResult.data) {
        setWebhookLogs(webhooksResult.data as WebhookLog[]);
      }
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setIsRunningCheck(true);
    try {
      const { error } = await supabase.functions.invoke("health-monitor", {
        body: { source: "manual" },
      });

      if (error) {
        toast({
          title: "Health Check Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Health Check Complete",
          description: "Results have been recorded.",
        });
        fetchData();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to run health check",
        variant: "destructive",
      });
    } finally {
      setIsRunningCheck(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    });
  };

  // Prepare chart data
  const latencyChartData = healthLogs
    .slice(0, 24)
    .reverse()
    .map((log) => {
      const dbResult = log.results?.find((r) => r.name === "Database");
      const authResult = log.results?.find((r) => r.name === "Authentication");
      const sitemapResult = log.results?.find((r) => r.name === "Sitemap Generator");
      return {
        time: format(new Date(log.created_at), "HH:mm"),
        database: dbResult?.latency || 0,
        auth: authResult?.latency || 0,
        sitemap: sitemapResult?.latency || 0,
      };
    });

  const statusDistribution = healthLogs.reduce(
    (acc, log) => {
      acc[log.overall_status] = (acc[log.overall_status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieChartData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: status,
    value: count,
    color: COLORS[status as keyof typeof COLORS] || "#6B7280",
  }));

  const activeIncidents = incidents.filter((i) => !i.resolved_at);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      healthy: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      degraded: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      unhealthy: "bg-red-500/10 text-red-600 border-red-500/30",
    };
    return variants[status] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">System Monitoring</h1>
          <p className="text-muted-foreground">Health checks, incidents, and webhook logs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={runHealthCheck} disabled={isRunningCheck}>
            <Activity className={`h-4 w-4 mr-2 ${isRunningCheck ? "animate-pulse" : ""}`} />
            Run Health Check
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Checks</p>
                  <p className="text-2xl font-bold">{healthLogs.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Incidents</p>
                  <p className="text-2xl font-bold text-red-500">{activeIncidents.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Webhook Events</p>
                  <p className="text-2xl font-bold">{webhookLogs.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Webhook className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime Rate</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {healthLogs.length > 0
                      ? `${Math.round(
                          (healthLogs.filter((l) => l.overall_status === "healthy").length /
                            healthLogs.length) *
                            100
                        )}%`
                      : "N/A"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* MLS Webhook URL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/5 to-blue-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              MLS Webhook Endpoint
            </CardTitle>
            <CardDescription>
              Use this URL in your MLS system to receive property update notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {webhookUrl}
              </code>
              <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={webhookUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Supported events:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {["property_created", "property_updated", "property_deleted", "property_status_changed"].map(
                  (event) => (
                    <Badge key={event} variant="outline" className="font-mono text-xs">
                      {event}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health" className="gap-2">
            <Activity className="h-4 w-4" />
            Health History
          </TabsTrigger>
          <TabsTrigger value="incidents" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Incidents
            {activeIncidents.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {activeIncidents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2">
            <Webhook className="h-4 w-4" />
            Webhook Logs
          </TabsTrigger>
          <TabsTrigger value="charts" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Health Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {healthLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${getStatusBadge(
                      log.overall_status
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.overall_status)}
                      <div>
                        <p className="font-medium capitalize">{log.overall_status}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {log.triggered_by}
                      </Badge>
                      {log.email_sent && (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                          Email Sent
                        </Badge>
                      )}
                      <div className="flex gap-1">
                        {log.results?.map((r) => (
                          <div
                            key={r.name}
                            title={`${r.name}: ${r.status} (${r.latency}ms)`}
                            className={`w-2 h-2 rounded-full ${
                              r.status === "healthy"
                                ? "bg-emerald-500"
                                : r.status === "degraded"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {healthLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No health check logs yet. Run a health check to get started.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Incident Log</CardTitle>
              <CardDescription>
                Services that experienced issues. Active incidents are shown first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      incident.resolved_at ? "bg-muted/30" : getStatusBadge(incident.status)
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(incident.resolved_at ? "healthy" : incident.status)}
                      <div>
                        <p className="font-medium">{incident.service_name}</p>
                        <p className="text-xs text-muted-foreground">{incident.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {incident.latency && (
                        <span className="text-muted-foreground">{incident.latency}ms</span>
                      )}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(incident.created_at), "MMM d, HH:mm")}
                        </p>
                        {incident.resolved_at && (
                          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {incidents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No incidents recorded. All systems have been healthy! 🎉
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Webhook Activity</CardTitle>
              <CardDescription>
                Recent webhook events from MLS integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {webhookLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Webhook className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm">{log.event_type}</p>
                        <p className="text-xs text-muted-foreground">
                          Property: {log.property_id || "N/A"} • IP: {log.source_ip || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {log.sitemap_regenerated && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          <Globe className="h-3 w-3 mr-1" />
                          Sitemap Updated
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                      </span>
                    </div>
                  </div>
                ))}
                {webhookLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No webhook events received yet. Configure your MLS to send events to the webhook URL above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Latency Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Service Latency (Last 24 Checks)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={latencyChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="database"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        name="Database"
                      />
                      <Line
                        type="monotone"
                        dataKey="auth"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        name="Auth"
                      />
                      <Line
                        type="monotone"
                        dataKey="sitemap"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={false}
                        name="Sitemap"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

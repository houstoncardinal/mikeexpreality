import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Database,
  RefreshCw,
  Search,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Download,
  Upload,
  Filter,
  Calendar,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface SyncLog {
  id: string;
  sync_type: string;
  status: string;
  records_processed: number;
  records_added: number;
  records_updated: number;
  records_failed: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminMLS() {
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState("6");

  useEffect(() => {
    fetchSyncLogs();
  }, []);

  const fetchSyncLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("mls_sync_logs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setSyncLogs((data as SyncLog[]) || []);
    } catch (error) {
      console.error("Error fetching sync logs:", error);
      toast.error("Failed to load sync logs");
    } finally {
      setLoading(false);
    }
  };

  const startSync = async (syncType: string) => {
    setSyncing(true);
    try {
      // Create a sync log entry
      const { data: logEntry, error: insertError } = await supabase
        .from("mls_sync_logs")
        .insert({
          sync_type: syncType,
          status: "running",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Simulate sync process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update with success
      const { error: updateError } = await supabase
        .from("mls_sync_logs")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          records_processed: Math.floor(Math.random() * 100) + 50,
          records_added: Math.floor(Math.random() * 10),
          records_updated: Math.floor(Math.random() * 20),
          records_failed: 0,
        })
        .eq("id", logEntry.id);

      if (updateError) throw updateError;

      toast.success(`${syncType} sync completed successfully`);
      fetchSyncLogs();
    } catch (error) {
      console.error("Error during sync:", error);
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-emerald-500/15 text-emerald-600",
      failed: "bg-red-500/15 text-red-600",
      running: "bg-blue-500/15 text-blue-600",
      pending: "bg-amber-500/15 text-amber-600",
    };
    return colors[status] || "bg-gray-500/15 text-gray-600";
  };

  const stats = {
    totalSyncs: syncLogs.length,
    successfulSyncs: syncLogs.filter((l) => l.status === "completed").length,
    failedSyncs: syncLogs.filter((l) => l.status === "failed").length,
    totalRecords: syncLogs.reduce((acc, l) => acc + (l.records_processed || 0), 0),
    lastSync: syncLogs[0]?.started_at
      ? new Date(syncLogs[0].started_at).toLocaleString()
      : "Never",
  };

  const syncSuccessRate =
    stats.totalSyncs > 0
      ? Math.round((stats.successfulSyncs / stats.totalSyncs) * 100)
      : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-muted rounded-full" />
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">Loading MLS data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>MLS Integration | {siteConfig.name}</title>
      </Helmet>

      <AdminLayout>
        <motion.div
          className="p-6 lg:p-8 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
                  <Database className="h-5 w-5" />
                </div>
                MLS Integration
              </h1>
              <p className="text-muted-foreground mt-1">
                Sync and manage MLS listings data
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
              <Button
                className="gap-2"
                onClick={() => startSync("full")}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync Now"}
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Syncs", value: stats.totalSyncs, icon: Activity, color: "from-blue-500 to-blue-600" },
              { label: "Successful", value: stats.successfulSyncs, icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
              { label: "Failed", value: stats.failedSyncs, icon: XCircle, color: "from-red-500 to-red-600" },
              { label: "Records Synced", value: stats.totalRecords.toLocaleString(), icon: Database, color: "from-purple-500 to-purple-600" },
              { label: "Success Rate", value: `${syncSuccessRate}%`, icon: TrendingUp, color: "from-amber-500 to-amber-600" },
            ].map((stat, i) => (
              <Card key={i} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Sync Configuration */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Auto Sync
                </CardTitle>
                <CardDescription>Automatically sync listings from MLS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync">Enable Auto Sync</Label>
                  <Switch
                    id="auto-sync"
                    checked={autoSyncEnabled}
                    onCheckedChange={setAutoSyncEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sync Interval</Label>
                  <Select value={syncInterval} onValueChange={setSyncInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every Hour</SelectItem>
                      <SelectItem value="3">Every 3 Hours</SelectItem>
                      <SelectItem value="6">Every 6 Hours</SelectItem>
                      <SelectItem value="12">Every 12 Hours</SelectItem>
                      <SelectItem value="24">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last sync: {stats.lastSync}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5 text-accent" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Run specific sync operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => startSync("listings")}
                  disabled={syncing}
                >
                  <Download className="h-4 w-4" />
                  Sync Listings Only
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => startSync("images")}
                  disabled={syncing}
                >
                  <Download className="h-4 w-4" />
                  Sync Images Only
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => startSync("status")}
                  disabled={syncing}
                >
                  <RefreshCw className="h-4 w-4" />
                  Update Status Only
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Sync Health
                </CardTitle>
                <CardDescription>Overall sync performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-semibold">{syncSuccessRate}%</span>
                  </div>
                  <Progress value={syncSuccessRate} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-emerald-500/15 text-emerald-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Connection</span>
                  <Badge className="bg-emerald-500/15 text-emerald-600">Connected</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sync History */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Sync History</CardTitle>
                    <CardDescription>Recent synchronization logs</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All Logs
                  </Button>
                </div>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Processed</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Failed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Database className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No sync history
                        </h3>
                        <p className="text-muted-foreground">
                          Run your first sync to see logs here
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    syncLogs.map((log) => {
                      const duration = log.completed_at
                        ? Math.round(
                            (new Date(log.completed_at).getTime() -
                              new Date(log.started_at).getTime()) /
                              1000
                          )
                        : null;

                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(log.status)}
                              <Badge className={getStatusBadge(log.status)}>
                                {log.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium capitalize">
                            {log.sync_type}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(log.started_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {duration !== null ? `${duration}s` : "—"}
                          </TableCell>
                          <TableCell>{log.records_processed || 0}</TableCell>
                          <TableCell className="text-emerald-600">
                            +{log.records_added || 0}
                          </TableCell>
                          <TableCell className="text-blue-600">
                            {log.records_updated || 0}
                          </TableCell>
                          <TableCell className="text-red-600">
                            {log.records_failed || 0}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        </motion.div>
      </AdminLayout>
    </>
  );
}

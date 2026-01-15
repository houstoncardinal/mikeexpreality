import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  Shield,
  Zap,
  Globe,
  RefreshCw,
  Server,
  Clock,
  AlertTriangle,
  Bell,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";

interface HealthCheck {
  name: string;
  status: "checking" | "healthy" | "degraded" | "unhealthy";
  latency?: number;
  message?: string;
  icon: React.ElementType;
}

export default function Health() {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { name: "Frontend", status: "checking", icon: Globe },
    { name: "Database", status: "checking", icon: Database },
    { name: "Authentication", status: "checking", icon: Shield },
    { name: "Edge Functions", status: "checking", icon: Zap },
    { name: "Sitemap Generator", status: "checking", icon: Server },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    runHealthChecks();
  }, []);

  const updateCheck = (name: string, update: Partial<HealthCheck>) => {
    setChecks((prev) =>
      prev.map((c) => (c.name === name ? { ...c, ...update } : c))
    );
  };

  const runHealthChecks = async () => {
    setIsRunning(true);
    
    // Reset all checks
    setChecks((prev) => prev.map((c) => ({ ...c, status: "checking" as const, latency: undefined, message: undefined })));

    // 1. Frontend check (always healthy if page loads)
    updateCheck("Frontend", {
      status: "healthy",
      latency: 0,
      message: "React app loaded successfully",
    });

    // 2. Database check
    try {
      const startDb = performance.now();
      const { error } = await supabase.from("properties").select("id").limit(1);
      const latencyDb = Math.round(performance.now() - startDb);
      
      if (error) {
        updateCheck("Database", {
          status: "unhealthy",
          latency: latencyDb,
          message: error.message,
        });
      } else {
        updateCheck("Database", {
          status: latencyDb > 1000 ? "degraded" : "healthy",
          latency: latencyDb,
          message: latencyDb > 1000 ? "Slow response time" : "Connected and responsive",
        });
      }
    } catch (err) {
      updateCheck("Database", {
        status: "unhealthy",
        message: "Connection failed",
      });
    }

    // 3. Authentication check
    try {
      const startAuth = performance.now();
      const { data, error } = await supabase.auth.getSession();
      const latencyAuth = Math.round(performance.now() - startAuth);
      
      if (error) {
        updateCheck("Authentication", {
          status: "unhealthy",
          latency: latencyAuth,
          message: error.message,
        });
      } else {
        updateCheck("Authentication", {
          status: "healthy",
          latency: latencyAuth,
          message: data.session ? "Session active" : "Auth service available",
        });
      }
    } catch (err) {
      updateCheck("Authentication", {
        status: "unhealthy",
        message: "Auth check failed",
      });
    }

    // 4. Edge Functions check (using a simple invoke)
    try {
      const startEdge = performance.now();
      const { error } = await supabase.functions.invoke("generate-sitemap", {
        method: "POST",
      });
      const latencyEdge = Math.round(performance.now() - startEdge);
      
      if (error) {
        updateCheck("Edge Functions", {
          status: "degraded",
          latency: latencyEdge,
          message: error.message || "Function returned error",
        });
      } else {
        updateCheck("Edge Functions", {
          status: latencyEdge > 2000 ? "degraded" : "healthy",
          latency: latencyEdge,
          message: latencyEdge > 2000 ? "Slow cold start" : "Functions operational",
        });
      }
    } catch (err) {
      updateCheck("Edge Functions", {
        status: "unhealthy",
        message: "Edge runtime unavailable",
      });
    }

    // 5. Sitemap Generator specific check
    try {
      const startSitemap = performance.now();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap?format=xml`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      const latencySitemap = Math.round(performance.now() - startSitemap);
      
      if (response.ok) {
        const text = await response.text();
        const urlCount = (text.match(/<url>/g) || []).length;
        updateCheck("Sitemap Generator", {
          status: "healthy",
          latency: latencySitemap,
          message: `Generated ${urlCount} URLs`,
        });
      } else {
        updateCheck("Sitemap Generator", {
          status: "degraded",
          latency: latencySitemap,
          message: `HTTP ${response.status}`,
        });
      }
    } catch (err) {
      updateCheck("Sitemap Generator", {
        status: "unhealthy",
        message: "Sitemap generation failed",
      });
    }

    setLastChecked(new Date());
    setIsRunning(false);
  };

  const getStatusColor = (status: HealthCheck["status"]) => {
    switch (status) {
      case "healthy":
        return "text-emerald-500";
      case "degraded":
        return "text-amber-500";
      case "unhealthy":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: HealthCheck["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-500/10 border-emerald-500/30";
      case "degraded":
        return "bg-amber-500/10 border-amber-500/30";
      case "unhealthy":
        return "bg-red-500/10 border-red-500/30";
      default:
        return "bg-muted/50 border-border";
    }
  };

  const getStatusIcon = (status: HealthCheck["status"]) => {
    switch (status) {
      case "healthy":
        return CheckCircle2;
      case "degraded":
        return AlertTriangle;
      case "unhealthy":
        return XCircle;
      default:
        return Loader2;
    }
  };

  const overallStatus = checks.every((c) => c.status === "healthy")
    ? "healthy"
    : checks.some((c) => c.status === "unhealthy")
    ? "unhealthy"
    : checks.some((c) => c.status === "degraded")
    ? "degraded"
    : "checking";

  return (
    <>
      <Helmet>
        <title>System Health | {siteConfig.name}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div
                className={`p-3 rounded-2xl ${getStatusBg(overallStatus)} border transition-all`}
              >
                {overallStatus === "checking" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : overallStatus === "healthy" ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                ) : overallStatus === "degraded" ? (
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              System Health
            </h1>
            <p className="text-muted-foreground">
              Real-time status of all critical services
            </p>
            <Badge
              variant={overallStatus === "healthy" ? "default" : "secondary"}
              className={`text-sm px-4 py-1 ${
                overallStatus === "healthy"
                  ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
                  : overallStatus === "degraded"
                  ? "bg-amber-500/20 text-amber-600 border-amber-500/30"
                  : overallStatus === "unhealthy"
                  ? "bg-red-500/20 text-red-600 border-red-500/30"
                  : ""
              }`}
            >
              {overallStatus === "checking"
                ? "Checking..."
                : overallStatus === "healthy"
                ? "All Systems Operational"
                : overallStatus === "degraded"
                ? "Partial Degradation"
                : "System Issues Detected"}
            </Badge>
          </motion.div>

          {/* Health Checks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Service Status</CardTitle>
                  <CardDescription>
                    {lastChecked
                      ? `Last checked ${lastChecked.toLocaleTimeString()}`
                      : "Running initial checks..."}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runHealthChecks}
                  disabled={isRunning}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {checks.map((check, index) => {
                  const StatusIcon = getStatusIcon(check.status);
                  return (
                    <motion.div
                      key={check.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-xl border ${getStatusBg(
                        check.status
                      )} transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            check.status === "checking"
                              ? "bg-muted"
                              : check.status === "healthy"
                              ? "bg-emerald-500/20"
                              : check.status === "degraded"
                              ? "bg-amber-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          <check.icon
                            className={`h-5 w-5 ${getStatusColor(check.status)}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {check.name}
                          </p>
                          {check.message && (
                            <p className="text-xs text-muted-foreground">
                              {check.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {check.latency !== undefined && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {check.latency}ms
                          </div>
                        )}
                        <StatusIcon
                          className={`h-5 w-5 ${getStatusColor(check.status)} ${
                            check.status === "checking" ? "animate-spin" : ""
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Automated Monitoring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Automated Monitoring
                </CardTitle>
                <CardDescription>
                  Health checks run automatically every 15 minutes. Email alerts are sent when issues are detected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Health Monitoring</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    Every 15 min
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Sitemap Regeneration</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                    Hourly
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Email Alerts</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                    On failure
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open("/sitemap.xml", "_blank")}
                >
                  <Globe className="h-4 w-4" />
                  View Sitemap
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open("/robots.txt", "_blank")}
                >
                  <Server className="h-4 w-4" />
                  View robots.txt
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => (window.location.href = "/")}
                >
                  <Globe className="h-4 w-4" />
                  Homepage
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => (window.location.href = "/admin")}
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Environment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-muted/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Environment</p>
                    <p className="font-medium">Production</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Region</p>
                    <p className="font-medium">Edge (Global)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Build</p>
                    <p className="font-medium font-mono text-xs">
                      {new Date().toISOString().split("T")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Project</p>
                    <p className="font-medium font-mono text-xs truncate">
                      {import.meta.env.VITE_SUPABASE_PROJECT_ID || "paccjyrmpbfkmwoxshmb"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

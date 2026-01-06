import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  CalendarDays,
  Search,
  Plus,
  Clock,
  MapPin,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Home,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface Showing {
  id: string;
  property_id: string;
  lead_id: string | null;
  agent_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  feedback: string | null;
  rating: number | null;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-500/15 text-blue-600" },
  confirmed: { label: "Confirmed", color: "bg-emerald-500/15 text-emerald-600" },
  completed: { label: "Completed", color: "bg-gray-500/15 text-gray-600" },
  cancelled: { label: "Cancelled", color: "bg-red-500/15 text-red-600" },
  no_show: { label: "No Show", color: "bg-amber-500/15 text-amber-600" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminShowings() {
  const [showings, setShowings] = useState<Showing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    fetchShowings();
  }, []);

  const fetchShowings = async () => {
    try {
      const { data, error } = await supabase
        .from("showings")
        .select("*")
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      setShowings((data as Showing[]) || []);
    } catch (error) {
      console.error("Error fetching showings:", error);
      toast.error("Failed to load showings");
    } finally {
      setLoading(false);
    }
  };

  const updateShowingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("showings").update({ status }).eq("id", id);

      if (error) throw error;

      setShowings(showings.map((s) => (s.id === id ? { ...s, status } : s)));
      toast.success("Showing status updated");
    } catch (error) {
      console.error("Error updating showing:", error);
      toast.error("Failed to update showing");
    }
  };

  const deleteShowing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this showing?")) return;

    try {
      const { error } = await supabase.from("showings").delete().eq("id", id);

      if (error) throw error;

      setShowings(showings.filter((s) => s.id !== id));
      toast.success("Showing deleted");
    } catch (error) {
      console.error("Error deleting showing:", error);
      toast.error("Failed to delete showing");
    }
  };

  const isToday = (date: string) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const isThisWeek = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return d >= weekStart && d <= weekEnd;
  };

  const isPast = (date: string) => {
    return new Date(date) < new Date();
  };

  const filteredShowings = showings.filter((showing) => {
    const matchesStatus = statusFilter === "all" || showing.status === statusFilter;
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && isToday(showing.scheduled_at)) ||
      (dateFilter === "week" && isThisWeek(showing.scheduled_at)) ||
      (dateFilter === "past" && isPast(showing.scheduled_at)) ||
      (dateFilter === "upcoming" && !isPast(showing.scheduled_at));

    return matchesStatus && matchesDate;
  });

  const stats = {
    total: showings.length,
    today: showings.filter((s) => isToday(s.scheduled_at)).length,
    upcoming: showings.filter((s) => !isPast(s.scheduled_at) && s.status !== "cancelled").length,
    completed: showings.filter((s) => s.status === "completed").length,
    avgRating:
      showings.filter((s) => s.rating).length > 0
        ? (
            showings.filter((s) => s.rating).reduce((acc, s) => acc + (s.rating || 0), 0) /
            showings.filter((s) => s.rating).length
          ).toFixed(1)
        : "N/A",
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-muted rounded-full" />
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">Loading showings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Showings | {siteConfig.name}</title>
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
                  <CalendarDays className="h-5 w-5" />
                </div>
                Showings & Appointments
              </h1>
              <p className="text-muted-foreground mt-1">
                Schedule and manage property showings
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Showing
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Showings", value: stats.total, icon: CalendarDays, color: "from-blue-500 to-blue-600" },
              { label: "Today", value: stats.today, icon: Calendar, color: "from-amber-500 to-amber-600" },
              { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "from-emerald-500 to-emerald-600" },
              { label: "Completed", value: stats.completed, icon: CheckCircle, color: "from-gray-500 to-gray-600" },
              { label: "Avg Rating", value: stats.avgRating, icon: Star, color: "from-purple-500 to-purple-600" },
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

          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search showings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Showings List */}
          <motion.div variants={itemVariants} className="space-y-4">
            {filteredShowings.length === 0 ? (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No showings found</h3>
                  <p className="text-muted-foreground mb-4">
                    {statusFilter !== "all" || dateFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Schedule your first showing to get started"}
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Showing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredShowings.map((showing) => (
                <motion.div
                  key={showing.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div
                      className={`h-1 ${
                        showing.status === "cancelled"
                          ? "bg-red-500"
                          : showing.status === "completed"
                          ? "bg-gray-500"
                          : isToday(showing.scheduled_at)
                          ? "bg-amber-500"
                          : "bg-accent"
                      }`}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-muted flex flex-col items-center min-w-[60px]">
                            <span className="text-xs font-medium text-muted-foreground uppercase">
                              {new Date(showing.scheduled_at).toLocaleDateString("en-US", { month: "short" })}
                            </span>
                            <span className="text-2xl font-bold text-foreground">
                              {new Date(showing.scheduled_at).getDate()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                {formatTime(showing.scheduled_at)}
                              </span>
                              <span className="text-muted-foreground">
                                ({showing.duration_minutes} min)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Home className="h-4 w-4" />
                              <span>Property #{showing.property_id.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge className={statusConfig[showing.status]?.color}>
                                {statusConfig[showing.status]?.label || showing.status}
                              </Badge>
                              {isToday(showing.scheduled_at) && showing.status !== "completed" && showing.status !== "cancelled" && (
                                <Badge variant="outline" className="border-amber-500 text-amber-600">
                                  Today
                                </Badge>
                              )}
                              {showing.rating && (
                                <Badge variant="outline" className="gap-1">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  {showing.rating}/5
                                </Badge>
                              )}
                            </div>
                            {showing.feedback && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                "{showing.feedback}"
                              </p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateShowingStatus(showing.id, "confirmed")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateShowingStatus(showing.id, "completed")}>
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateShowingStatus(showing.id, "cancelled")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteShowing(showing.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </AdminLayout>
    </>
  );
}

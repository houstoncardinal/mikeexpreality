import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Filter,
  Search,
  Bell,
  ArrowUpRight,
  MoreHorizontal,
  Repeat,
  Target,
  TrendingUp,
  Play,
  Pause,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface FollowUp {
  id: string;
  lead_id: string;
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  type: "call" | "email" | "text" | "meeting";
  status: "pending" | "completed" | "overdue" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  scheduled_at: string;
  notes: string;
  attempts: number;
  last_attempt: string | null;
  created_at: string;
}

const typeConfig = {
  call: { label: "Phone Call", icon: Phone, color: "bg-blue-500" },
  email: { label: "Email", icon: Mail, color: "bg-emerald-500" },
  text: { label: "Text Message", icon: MessageSquare, color: "bg-purple-500" },
  meeting: { label: "Meeting", icon: Calendar, color: "bg-amber-500" },
};

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  overdue: { label: "Overdue", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  cancelled: { label: "Cancelled", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-500" },
  medium: { label: "Medium", color: "bg-blue-500" },
  high: { label: "High", color: "bg-orange-500" },
  urgent: { label: "Urgent", color: "bg-red-500" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Mock data
const mockFollowUps: FollowUp[] = [
  {
    id: "1",
    lead_id: "l1",
    lead_name: "Sarah Mitchell",
    lead_email: "sarah.m@email.com",
    lead_phone: "(832) 555-0101",
    type: "call",
    status: "pending",
    priority: "high",
    scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    notes: "Follow up on Riverstone property showing",
    attempts: 1,
    last_attempt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    lead_id: "l2",
    lead_name: "John & Lisa Kennedy",
    lead_email: "kennedy.family@email.com",
    lead_phone: "(832) 555-0202",
    type: "email",
    status: "pending",
    priority: "medium",
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    notes: "Send listing presentation materials",
    attempts: 0,
    last_attempt: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    lead_id: "l3",
    lead_name: "Michael Rodriguez",
    lead_email: "mrodriguez@email.com",
    lead_phone: "(832) 555-0303",
    type: "meeting",
    status: "overdue",
    priority: "urgent",
    scheduled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Buyer consultation meeting",
    attempts: 2,
    last_attempt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    lead_id: "l4",
    lead_name: "Emily Chen",
    lead_email: "echen@email.com",
    lead_phone: "(832) 555-0404",
    type: "text",
    status: "completed",
    priority: "low",
    scheduled_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Thank you message after closing",
    attempts: 1,
    last_attempt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    lead_id: "l5",
    lead_name: "David Thompson",
    lead_email: "dthompson@email.com",
    lead_phone: "(832) 555-0505",
    type: "call",
    status: "pending",
    priority: "high",
    scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    notes: "Discuss price reduction strategy",
    attempts: 0,
    last_attempt: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AdminFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const filteredFollowUps = followUps.filter((f) => {
    const matchesSearch =
      f.lead_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.lead_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    const matchesType = typeFilter === "all" || f.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: followUps.length,
    pending: followUps.filter((f) => f.status === "pending").length,
    overdue: followUps.filter((f) => f.status === "overdue").length,
    completed: followUps.filter((f) => f.status === "completed").length,
    todayDue: followUps.filter((f) => {
      const dueDate = new Date(f.scheduled_at);
      const today = new Date();
      return dueDate.toDateString() === today.toDateString() && f.status === "pending";
    }).length,
  };

  const markComplete = (id: string) => {
    setFollowUps(prev =>
      prev.map(f => f.id === id ? { ...f, status: "completed" as const } : f)
    );
    toast.success("Follow-up marked as complete");
  };

  const reschedule = (id: string) => {
    toast.info("Reschedule dialog would open here");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (hours < 1) return "Due now";
    if (hours < 24) return `In ${hours}h`;
    return `In ${days}d`;
  };

  return (
    <>
      <Helmet>
        <title>Follow-Up Management | {siteConfig.name}</title>
      </Helmet>

      <motion.div
        className="p-6 lg:p-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-amber-600 text-white shadow-lg shadow-accent/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Bell className="h-5 w-5" />
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
                  Follow-Up Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage all lead follow-ups
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-white shadow-lg">
              <Plus className="h-4 w-4" />
              New Follow-Up
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Follow-Ups", value: stats.total, icon: Target, color: "from-blue-500 to-indigo-600" },
            { label: "Due Today", value: stats.todayDue, icon: Clock, color: "from-amber-500 to-orange-600" },
            { label: "Pending", value: stats.pending, icon: Play, color: "from-yellow-500 to-amber-600" },
            { label: "Overdue", value: stats.overdue, icon: AlertTriangle, color: "from-red-500 to-rose-600" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-card/80">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Follow-Ups Table */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-card/80">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Lead</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFollowUps.map((followUp, index) => {
                    const TypeIcon = typeConfig[followUp.type].icon;
                    return (
                      <TableRow
                        key={followUp.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-gradient-to-br from-accent to-amber-600 text-white text-xs font-semibold">
                                {followUp.lead_name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{followUp.lead_name}</p>
                              <p className="text-xs text-muted-foreground">{followUp.lead_phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${typeConfig[followUp.type].color}`}>
                              <TypeIcon className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="text-sm">{typeConfig[followUp.type].label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${
                            followUp.status === "overdue" ? "text-red-500" : ""
                          }`}>
                            {formatDate(followUp.scheduled_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${priorityConfig[followUp.priority].color}`} />
                            <span className="text-sm">{priorityConfig[followUp.priority].label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[followUp.status].color}>
                            {statusConfig[followUp.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{followUp.attempts}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground truncate max-w-48">
                            {followUp.notes}
                          </p>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => markComplete(followUp.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => reschedule(followUp.id)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredFollowUps.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No follow-ups found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
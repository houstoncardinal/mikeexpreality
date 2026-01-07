import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Video,
  Calendar,
  Clock,
  Plus,
  Search,
  Users,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  UserPlus,
  Building2,
  Bell,
  Copy,
  Link2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meeting_type: "client" | "team" | "training" | "showing" | "closing" | "other";
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  virtual_link: string | null;
  attendees: { name: string; email: string; avatar?: string }[];
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes: string | null;
  reminders: boolean;
  property_address?: string;
  created_at: string;
}

// Mock data for demo
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Client Showing - Riverstone Estate",
    description: "Initial showing for potential buyers",
    meeting_type: "showing",
    scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 60,
    location: "4521 Riverstone Blvd, Houston, TX",
    virtual_link: null,
    attendees: [
      { name: "Sarah Martinez", email: "sarah@email.com" },
      { name: "Mike Johnson", email: "mike@morerealestate.com" },
    ],
    status: "scheduled",
    notes: "Clients interested in 4BR homes. Budget: $850K-1M",
    reminders: true,
    property_address: "4521 Riverstone Blvd",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Weekly Team Standup",
    description: "Review weekly goals and pipeline",
    meeting_type: "team",
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 30,
    location: null,
    virtual_link: "https://zoom.us/j/123456789",
    attendees: [
      { name: "Mike Johnson", email: "mike@morerealestate.com" },
      { name: "Lisa Chen", email: "lisa@morerealestate.com" },
      { name: "David Kim", email: "david@morerealestate.com" },
    ],
    status: "scheduled",
    notes: null,
    reminders: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Closing Meeting - Thompson Deal",
    description: "Final closing documents signing",
    meeting_type: "closing",
    scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 90,
    location: "Capital Title - Memorial Dr",
    virtual_link: null,
    attendees: [
      { name: "Robert Thompson", email: "robert@email.com" },
      { name: "Jennifer Thompson", email: "jennifer@email.com" },
      { name: "Mike Johnson", email: "mike@morerealestate.com" },
    ],
    status: "scheduled",
    notes: "All documents ready. Bring certified check.",
    reminders: true,
    property_address: "8234 Memorial Dr",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Listing Presentation - Oak Forest",
    description: "Present marketing strategy to potential sellers",
    meeting_type: "client",
    scheduled_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 45,
    location: "1234 Oak Forest Lane",
    virtual_link: null,
    attendees: [
      { name: "Amanda & John Parker", email: "parker@email.com" },
    ],
    status: "completed",
    notes: "Presentation went well. Following up tomorrow.",
    reminders: true,
    created_at: new Date().toISOString(),
  },
];

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  client: { label: "Client Meeting", color: "bg-blue-500/15 text-blue-600", icon: Users },
  team: { label: "Team Meeting", color: "bg-purple-500/15 text-purple-600", icon: Users },
  training: { label: "Training", color: "bg-emerald-500/15 text-emerald-600", icon: Video },
  showing: { label: "Property Showing", color: "bg-amber-500/15 text-amber-600", icon: Building2 },
  closing: { label: "Closing", color: "bg-green-500/15 text-green-600", icon: CheckCircle },
  other: { label: "Other", color: "bg-gray-500/15 text-gray-600", icon: Calendar },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-500/15 text-blue-600" },
  in_progress: { label: "In Progress", color: "bg-amber-500/15 text-amber-600" },
  completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-600" },
  cancelled: { label: "Cancelled", color: "bg-red-500/15 text-red-600" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    meeting_type: "client",
    scheduled_at: "",
    duration_minutes: "60",
    location: "",
    virtual_link: "",
    notes: "",
    reminders: true,
  });

  const isToday = (date: string) => new Date(date).toDateString() === new Date().toDateString();
  const isPast = (date: string) => new Date(date) < new Date();
  const isUpcoming = (date: string) => {
    const meetingDate = new Date(date);
    const now = new Date();
    const hourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    return meetingDate > now && meetingDate <= hourFromNow;
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || meeting.meeting_type === typeFilter;
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const todayMeetings = meetings.filter((m) => isToday(m.scheduled_at) && m.status !== "cancelled");
  const upcomingMeetings = meetings.filter((m) => !isPast(m.scheduled_at) && m.status === "scheduled");

  const stats = {
    today: todayMeetings.length,
    upcoming: upcomingMeetings.length,
    completed: meetings.filter((m) => m.status === "completed").length,
    totalThisWeek: meetings.filter((m) => {
      const d = new Date(m.scheduled_at);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return d >= now && d <= weekFromNow;
    }).length,
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(dateStr)) return "Today";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const addMeeting = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      description: newMeeting.description || null,
      meeting_type: newMeeting.meeting_type as Meeting["meeting_type"],
      scheduled_at: new Date(newMeeting.scheduled_at).toISOString(),
      duration_minutes: parseInt(newMeeting.duration_minutes),
      location: newMeeting.location || null,
      virtual_link: newMeeting.virtual_link || null,
      attendees: [],
      status: "scheduled",
      notes: newMeeting.notes || null,
      reminders: newMeeting.reminders,
      created_at: new Date().toISOString(),
    };
    setMeetings([meeting, ...meetings]);
    setIsAddDialogOpen(false);
    setNewMeeting({
      title: "",
      description: "",
      meeting_type: "client",
      scheduled_at: "",
      duration_minutes: "60",
      location: "",
      virtual_link: "",
      notes: "",
      reminders: true,
    });
    toast.success("Meeting scheduled successfully");
  };

  const updateMeetingStatus = (id: string, status: Meeting["status"]) => {
    setMeetings(meetings.map((m) => (m.id === id ? { ...m, status } : m)));
    toast.success(`Meeting ${status}`);
  };

  const deleteMeeting = (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    setMeetings(meetings.filter((m) => m.id !== id));
    toast.success("Meeting deleted");
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied to clipboard");
  };

  return (
    <>
      <Helmet>
        <title>Meetings | {siteConfig.name}</title>
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
                  <Video className="h-5 w-5" />
                </div>
                Meetings & Calendar
              </h1>
              <p className="text-muted-foreground mt-1">
                Schedule and manage all your appointments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                </TabsList>
              </Tabs>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-lg">
                    <Plus className="h-4 w-4" />
                    New Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Schedule New Meeting</DialogTitle>
                    <DialogDescription>
                      Create a new meeting or appointment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Meeting Title *</Label>
                      <Input
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                        placeholder="Client Meeting - Property Showing"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Meeting Type</Label>
                        <Select
                          value={newMeeting.meeting_type}
                          onValueChange={(v) => setNewMeeting({ ...newMeeting, meeting_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Client Meeting</SelectItem>
                            <SelectItem value="team">Team Meeting</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="showing">Property Showing</SelectItem>
                            <SelectItem value="closing">Closing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Select
                          value={newMeeting.duration_minutes}
                          onValueChange={(v) => setNewMeeting({ ...newMeeting, duration_minutes: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Date & Time *</Label>
                      <Input
                        type="datetime-local"
                        value={newMeeting.scheduled_at}
                        onChange={(e) => setNewMeeting({ ...newMeeting, scheduled_at: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={newMeeting.location}
                        onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                        placeholder="123 Main St or leave blank for virtual"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Virtual Meeting Link</Label>
                      <Input
                        value={newMeeting.virtual_link}
                        onChange={(e) => setNewMeeting({ ...newMeeting, virtual_link: e.target.value })}
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newMeeting.description}
                        onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                        placeholder="Meeting details..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={newMeeting.notes}
                        onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                        placeholder="Internal notes..."
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminders">Enable Reminders</Label>
                      <Switch
                        id="reminders"
                        checked={newMeeting.reminders}
                        onCheckedChange={(v) => setNewMeeting({ ...newMeeting, reminders: v })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addMeeting} disabled={!newMeeting.title || !newMeeting.scheduled_at}>
                      Schedule Meeting
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Today", value: stats.today, icon: Calendar, color: "from-amber-500 to-amber-600", highlight: stats.today > 0 },
              { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "from-blue-500 to-blue-600" },
              { label: "This Week", value: stats.totalThisWeek, icon: Video, color: "from-purple-500 to-purple-600" },
              { label: "Completed", value: stats.completed, icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className={`border-0 shadow-lg bg-card/50 backdrop-blur-sm ${stat.highlight ? "ring-2 ring-amber-500/50" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
                      placeholder="Search meetings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-44">
                      <SelectValue placeholder="Meeting Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="client">Client Meeting</SelectItem>
                      <SelectItem value="team">Team Meeting</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="showing">Property Showing</SelectItem>
                      <SelectItem value="closing">Closing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meetings List */}
          <motion.div variants={itemVariants} className="space-y-4">
            {filteredMeetings.length === 0 ? (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No meetings found</h3>
                  <p className="text-muted-foreground mb-4">Schedule your first meeting to get started</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence>
                {filteredMeetings
                  .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
                  .map((meeting, index) => {
                    const TypeIcon = typeConfig[meeting.meeting_type]?.icon || Calendar;
                    const isStartingSoon = isUpcoming(meeting.scheduled_at);
                    
                    return (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <Card className={`border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden ${isStartingSoon ? "ring-2 ring-amber-500" : ""}`}>
                          <div
                            className={`h-1 ${
                              meeting.status === "cancelled"
                                ? "bg-red-500"
                                : meeting.status === "completed"
                                ? "bg-gray-500"
                                : isStartingSoon
                                ? "bg-amber-500 animate-pulse"
                                : isToday(meeting.scheduled_at)
                                ? "bg-accent"
                                : "bg-blue-500"
                            }`}
                          />
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 rounded-xl bg-muted flex flex-col items-center min-w-[60px]">
                                  <span className="text-xs font-medium text-muted-foreground uppercase">
                                    {formatDate(meeting.scheduled_at).includes("Today") || formatDate(meeting.scheduled_at).includes("Tomorrow")
                                      ? formatDate(meeting.scheduled_at)
                                      : new Date(meeting.scheduled_at).toLocaleDateString("en-US", { month: "short" })}
                                  </span>
                                  {!formatDate(meeting.scheduled_at).includes("Today") && !formatDate(meeting.scheduled_at).includes("Tomorrow") && (
                                    <span className="text-2xl font-bold text-foreground">
                                      {new Date(meeting.scheduled_at).getDate()}
                                    </span>
                                  )}
                                  {(formatDate(meeting.scheduled_at).includes("Today") || formatDate(meeting.scheduled_at).includes("Tomorrow")) && (
                                    <span className="text-lg font-bold text-foreground">
                                      {formatTime(meeting.scheduled_at)}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-foreground truncate">
                                      {meeting.title}
                                    </h3>
                                    {isStartingSoon && (
                                      <Badge className="bg-amber-500/15 text-amber-600 animate-pulse">
                                        Starting Soon
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{formatTime(meeting.scheduled_at)} ({meeting.duration_minutes} min)</span>
                                    </div>
                                    {meeting.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span className="truncate max-w-[200px]">{meeting.location}</span>
                                      </div>
                                    )}
                                    {meeting.virtual_link && (
                                      <div className="flex items-center gap-1 text-blue-600">
                                        <Video className="h-3.5 w-3.5" />
                                        <span>Virtual</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <Badge className={typeConfig[meeting.meeting_type]?.color}>
                                      <TypeIcon className="h-3 w-3 mr-1" />
                                      {typeConfig[meeting.meeting_type]?.label}
                                    </Badge>
                                    <Badge className={statusConfig[meeting.status]?.color}>
                                      {statusConfig[meeting.status]?.label}
                                    </Badge>
                                    
                                    {meeting.attendees.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <div className="flex -space-x-2">
                                          {meeting.attendees.slice(0, 3).map((attendee, i) => (
                                            <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                              <AvatarFallback className="text-[10px] bg-muted">
                                                {attendee.name.split(" ").map(n => n[0]).join("")}
                                              </AvatarFallback>
                                            </Avatar>
                                          ))}
                                        </div>
                                        {meeting.attendees.length > 3 && (
                                          <span className="text-xs text-muted-foreground">
                                            +{meeting.attendees.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {meeting.notes && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                                      📝 {meeting.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {meeting.virtual_link && meeting.status === "scheduled" && (
                                  <Button
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={() => window.open(meeting.virtual_link!, "_blank")}
                                  >
                                    <Play className="h-3.5 w-3.5" />
                                    Join
                                  </Button>
                                )}
                                
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
                                    {meeting.virtual_link && (
                                      <DropdownMenuItem onClick={() => copyMeetingLink(meeting.virtual_link!)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy Link
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <UserPlus className="h-4 w-4 mr-2" />
                                      Add Attendee
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {meeting.status === "scheduled" && (
                                      <DropdownMenuItem onClick={() => updateMeetingStatus(meeting.id, "completed")}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark Completed
                                      </DropdownMenuItem>
                                    )}
                                    {meeting.status === "scheduled" && (
                                      <DropdownMenuItem onClick={() => updateMeetingStatus(meeting.id, "cancelled")}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => deleteMeeting(meeting.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </AdminLayout>
    </>
  );
}

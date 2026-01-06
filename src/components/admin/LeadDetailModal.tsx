import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  User,
  Building,
  History,
  Plus,
  Send,
  CalendarPlus,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  property_id: string | null;
  property_address: string | null;
  lead_source: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  converted_at: string | null;
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

const STATUS_COLORS = {
  new: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  contacted: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  qualified: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
  converted: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  lost: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-300", dot: "bg-rose-500" },
};

const ACTIVITY_ICONS = {
  created: Calendar,
  status_change: CheckCircle,
  note_added: MessageSquare,
  follow_up: Clock,
  email_sent: Mail,
  call_made: Phone,
};

export function LeadDetailModal({ lead, onClose, onUpdate }: LeadDetailModalProps) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [newNote, setNewNote] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [schedulingFollowUp, setSchedulingFollowUp] = useState(false);

  // Mock activity history (in production, this would come from a separate table)
  const activityHistory = [
    {
      id: 1,
      type: "created",
      description: "Lead created from website",
      timestamp: lead.created_at,
    },
    ...(lead.status !== "new" ? [{
      id: 2,
      type: "status_change",
      description: `Status changed to ${lead.status}`,
      timestamp: new Date(new Date(lead.created_at).getTime() + 86400000).toISOString(),
    }] : []),
    ...(lead.converted_at ? [{
      id: 3,
      type: "status_change",
      description: "Lead converted to client",
      timestamp: lead.converted_at,
    }] : []),
  ];

  const statusColors = STATUS_COLORS[(lead.status as keyof typeof STATUS_COLORS) || "new"];

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    const updatedNotes = newNote 
      ? `${notes}\n\n[${format(new Date(), "MMM d, yyyy h:mm a")}]\n${newNote}`.trim()
      : notes;

    const { error } = await supabase
      .from("leads")
      .update({ notes: updatedNotes })
      .eq("id", lead.id);

    if (error) {
      toast.error("Failed to save notes");
    } else {
      setNotes(updatedNotes);
      setNewNote("");
      setIsEditingNotes(false);
      onUpdate({ ...lead, notes: updatedNotes });
      toast.success("Notes saved successfully");
    }
    setSavingNotes(false);
  };

  const handleScheduleFollowUp = async () => {
    if (!followUpDate || !followUpTime) {
      toast.error("Please select a date and time");
      return;
    }

    setSchedulingFollowUp(true);
    
    // Add follow-up to notes (in production, this would be a separate follow_ups table)
    const followUpEntry = `\n\n[FOLLOW-UP SCHEDULED: ${format(new Date(`${followUpDate}T${followUpTime}`), "MMMM d, yyyy 'at' h:mm a")}]\n${followUpNote || "Scheduled follow-up"}`;
    const updatedNotes = (notes + followUpEntry).trim();

    const { error } = await supabase
      .from("leads")
      .update({ notes: updatedNotes })
      .eq("id", lead.id);

    if (error) {
      toast.error("Failed to schedule follow-up");
    } else {
      setNotes(updatedNotes);
      setFollowUpDate("");
      setFollowUpTime("");
      setFollowUpNote("");
      onUpdate({ ...lead, notes: updatedNotes });
      toast.success("Follow-up scheduled successfully");
    }
    setSchedulingFollowUp(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    const updates: Partial<Lead> = { status: newStatus };
    if (newStatus === "converted") {
      updates.converted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", lead.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      onUpdate({ ...lead, ...updates });
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-accent-foreground text-xl font-bold shadow-lg">
                  {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">{lead.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-accent transition-colors">
                      <Mail className="h-4 w-4" />
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-accent transition-colors">
                        <Phone className="h-4 w-4" />
                        {lead.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${statusColors.bg} ${statusColors.text} border-0 px-3 py-1`}>
                  <span className={`w-2 h-2 rounded-full ${statusColors.dot} mr-2`} />
                  {(lead.status || "new").charAt(0).toUpperCase() + (lead.status || "new").slice(1)}
                </Badge>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <Tabs defaultValue="overview" className="w-full">
              <div className="px-6 pt-4 border-b border-border">
                <TabsList className="grid w-full max-w-md grid-cols-4 bg-secondary/50">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="followup">Follow-up</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-6 space-y-6">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-accent" />
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">{format(new Date(lead.created_at), "MMM d, yyyy")}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-accent" />
                    <p className="text-xs text-muted-foreground">Time Ago</p>
                    <p className="text-sm font-medium">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Building className="h-5 w-5 mx-auto mb-2 text-accent" />
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="text-sm font-medium capitalize">{lead.lead_source || "Website"}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <User className="h-5 w-5 mx-auto mb-2 text-accent" />
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium capitalize">{lead.status || "New"}</p>
                  </Card>
                </div>

                {/* Property Interest */}
                {lead.property_address && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Property of Interest</p>
                        <p className="font-medium text-foreground">{lead.property_address}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Message */}
                {lead.message && (
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <MessageSquare className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">Original Message</p>
                        <p className="text-foreground whitespace-pre-wrap">{lead.message}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Status Change */}
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["new", "contacted", "qualified", "converted", "lost"].map((status) => (
                      <Button
                        key={status}
                        variant={lead.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(status)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <a href={`mailto:${lead.email}`}>
                    <Button variant="outline" className="w-full gap-2">
                      <Mail className="h-4 w-4" />
                      Send Email
                    </Button>
                  </a>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`}>
                      <Button variant="outline" className="w-full gap-2">
                        <Phone className="h-4 w-4" />
                        Call Now
                      </Button>
                    </a>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-6 space-y-4">
                {/* Existing Notes */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Lead Notes</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingNotes(!isEditingNotes)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      {isEditingNotes ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  {isEditingNotes ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                      placeholder="Add notes about this lead..."
                      className="resize-none"
                    />
                  ) : (
                    <div className="min-h-[100px] text-sm text-muted-foreground whitespace-pre-wrap">
                      {notes || "No notes yet. Click Edit to add notes."}
                    </div>
                  )}
                </Card>

                {/* Add New Note */}
                <Card className="p-4">
                  <p className="text-sm font-medium text-foreground mb-3">Add Quick Note</p>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    placeholder="Type a quick note..."
                    className="resize-none mb-3"
                  />
                  <Button 
                    onClick={handleSaveNotes} 
                    disabled={savingNotes || (!newNote && !isEditingNotes)}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="followup" className="p-6 space-y-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <CalendarPlus className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Schedule Follow-up</p>
                      <p className="text-sm text-muted-foreground">Set a reminder to follow up with this lead</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Date</label>
                      <Input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        min={format(new Date(), "yyyy-MM-dd")}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Time</label>
                      <Input
                        type="time"
                        value={followUpTime}
                        onChange={(e) => setFollowUpTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground mb-1 block">Note (optional)</label>
                    <Textarea
                      value={followUpNote}
                      onChange={(e) => setFollowUpNote(e.target.value)}
                      rows={2}
                      placeholder="What should be discussed during follow-up?"
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleScheduleFollowUp}
                    disabled={schedulingFollowUp}
                    className="w-full gap-2"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    {schedulingFollowUp ? "Scheduling..." : "Schedule Follow-up"}
                  </Button>
                </Card>

                {/* Quick Follow-up Templates */}
                <Card className="p-4">
                  <p className="text-sm font-medium text-foreground mb-3">Quick Schedule</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Tomorrow 10am", days: 1, hour: 10 },
                      { label: "Tomorrow 2pm", days: 1, hour: 14 },
                      { label: "In 3 days", days: 3, hour: 10 },
                      { label: "Next week", days: 7, hour: 10 },
                    ].map((preset) => {
                      const date = new Date();
                      date.setDate(date.getDate() + preset.days);
                      date.setHours(preset.hour, 0, 0, 0);
                      return (
                        <Button
                          key={preset.label}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFollowUpDate(format(date, "yyyy-MM-dd"));
                            setFollowUpTime(format(date, "HH:mm"));
                          }}
                        >
                          {preset.label}
                        </Button>
                      );
                    })}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="p-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <History className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Activity Timeline</p>
                      <p className="text-sm text-muted-foreground">Complete history of interactions</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activityHistory.map((activity, index) => {
                      const Icon = ACTIVITY_ICONS[activity.type as keyof typeof ACTIVITY_ICONS] || MessageSquare;
                      return (
                        <div key={activity.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="p-2 rounded-full bg-secondary">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {index < activityHistory.length - 1 && (
                              <div className="w-0.5 flex-1 bg-border mt-2" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="text-sm font-medium text-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(activity.timestamp), "MMMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Lead ID: {lead.id.slice(0, 8)}...
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <a href={`mailto:${lead.email}`}>
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Contact Lead
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

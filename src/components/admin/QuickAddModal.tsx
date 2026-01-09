import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Home, Calendar, FileText, Loader2 } from "lucide-react";

interface QuickAddModalProps {
  type: "lead" | "property" | "showing" | "task";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function QuickAddModal({ type, open, onOpenChange, onSuccess }: QuickAddModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Lead form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    lead_source: "website",
    message: "",
    property_address: "",
  });

  // Property form state
  const [propertyForm, setPropertyForm] = useState({
    title: "",
    price: "",
    address_line1: "",
    city: "",
    state: "TX",
    zip_code: "",
    property_type: "single_family",
    status: "active",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
  });

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    task_type: "general",
    due_date: "",
  });

  const resetForms = () => {
    setLeadForm({
      name: "",
      email: "",
      phone: "",
      lead_source: "website",
      message: "",
      property_address: "",
    });
    setPropertyForm({
      title: "",
      price: "",
      address_line1: "",
      city: "",
      state: "TX",
      zip_code: "",
      property_type: "single_family",
      status: "active",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
    });
    setTaskForm({
      title: "",
      description: "",
      priority: "medium",
      task_type: "general",
      due_date: "",
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (type === "lead") {
        if (!leadForm.name || !leadForm.email) {
          toast.error("Name and email are required");
          return;
        }
        const { error } = await supabase.from("leads").insert([{
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone || null,
          lead_source: leadForm.lead_source,
          message: leadForm.message || null,
          property_address: leadForm.property_address || null,
          status: "new",
        }]);
        if (error) throw error;
        toast.success("Lead added successfully!");
      } else if (type === "property") {
        if (!propertyForm.title || !propertyForm.price || !propertyForm.address_line1 || !propertyForm.city || !propertyForm.zip_code) {
          toast.error("Please fill in all required fields");
          return;
        }
        const { error } = await supabase.from("properties").insert([{
          title: propertyForm.title,
          price: parseFloat(propertyForm.price),
          address_line1: propertyForm.address_line1,
          city: propertyForm.city,
          state: propertyForm.state,
          zip_code: propertyForm.zip_code,
          property_type: propertyForm.property_type as any,
          status: propertyForm.status as any,
          bedrooms: propertyForm.bedrooms ? parseInt(propertyForm.bedrooms) : null,
          bathrooms: propertyForm.bathrooms ? parseFloat(propertyForm.bathrooms) : null,
          sqft: propertyForm.sqft ? parseInt(propertyForm.sqft) : null,
          listing_date: new Date().toISOString().split("T")[0],
        }]);
        if (error) throw error;
        toast.success("Property added successfully!");
      } else if (type === "task") {
        if (!taskForm.title) {
          toast.error("Task title is required");
          return;
        }
        const { error } = await supabase.from("tasks").insert([{
          title: taskForm.title,
          description: taskForm.description || null,
          priority: taskForm.priority,
          task_type: taskForm.task_type,
          due_date: taskForm.due_date ? new Date(taskForm.due_date).toISOString() : null,
          status: "pending",
        }]);
        if (error) throw error;
        toast.success("Task added successfully!");
      }
      
      resetForms();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding:", error);
      toast.error(error.message || "Failed to add. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "lead": return <Users className="h-5 w-5" />;
      case "property": return <Home className="h-5 w-5" />;
      case "showing": return <Calendar className="h-5 w-5" />;
      case "task": return <FileText className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "lead": return "Add New Lead";
      case "property": return "Add New Property";
      case "showing": return "Schedule Showing";
      case "task": return "Create Task";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              {getIcon()}
            </div>
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to quickly add a new {type}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type === "lead" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="(713) 555-0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lead Source</Label>
                  <Select
                    value={leadForm.lead_source}
                    onValueChange={(v) => setLeadForm({ ...leadForm, lead_source: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="zillow">Zillow</SelectItem>
                      <SelectItem value="realtor">Realtor.com</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="open_house">Open House</SelectItem>
                      <SelectItem value="cold_call">Cold Call</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Property Interest</Label>
                <Input
                  value={leadForm.property_address}
                  onChange={(e) => setLeadForm({ ...leadForm, property_address: e.target.value })}
                  placeholder="123 Main St, Houston, TX"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes/Message</Label>
                <Textarea
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                  placeholder="Looking for a 4BR home in River Oaks..."
                  rows={3}
                />
              </div>
            </>
          )}

          {type === "property" && (
            <>
              <div className="space-y-2">
                <Label>Property Title *</Label>
                <Input
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                  placeholder="Beautiful 4BR Home in River Oaks"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                    placeholder="450000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={propertyForm.property_type}
                    onValueChange={(v) => setPropertyForm({ ...propertyForm, property_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_family">Single Family</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="multi_family">Multi-Family</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input
                  value={propertyForm.address_line1}
                  onChange={(e) => setPropertyForm({ ...propertyForm, address_line1: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={propertyForm.city}
                    onChange={(e) => setPropertyForm({ ...propertyForm, city: e.target.value })}
                    placeholder="Houston"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={propertyForm.state}
                    onChange={(e) => setPropertyForm({ ...propertyForm, state: e.target.value })}
                    placeholder="TX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ZIP *</Label>
                  <Input
                    value={propertyForm.zip_code}
                    onChange={(e) => setPropertyForm({ ...propertyForm, zip_code: e.target.value })}
                    placeholder="77002"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Beds</Label>
                  <Input
                    type="number"
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                    placeholder="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Baths</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                    placeholder="3.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sq Ft</Label>
                  <Input
                    type="number"
                    value={propertyForm.sqft}
                    onChange={(e) => setPropertyForm({ ...propertyForm, sqft: e.target.value })}
                    placeholder="2500"
                  />
                </div>
              </div>
            </>
          )}

          {type === "task" && (
            <>
              <div className="space-y-2">
                <Label>Task Title *</Label>
                <Input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Follow up with client"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={taskForm.priority}
                    onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Task Type</Label>
                  <Select
                    value={taskForm.task_type}
                    onValueChange={(v) => setTaskForm({ ...taskForm, task_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="showing">Showing</SelectItem>
                      <SelectItem value="paperwork">Paperwork</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="datetime-local"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task details..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {loading ? "Adding..." : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

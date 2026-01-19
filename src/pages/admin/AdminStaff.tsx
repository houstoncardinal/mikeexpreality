import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Award,
  Calendar,
  TrendingUp,
  UserCheck,
  Briefcase,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Progress } from "@/components/ui/progress";

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  license_number: string | null;
  license_expiry: string | null;
  hire_date: string | null;
  commission_rate: number | null;
  is_active: boolean;
  specializations: string[] | null;
  languages: string[] | null;
  performance_metrics: {
    listings_sold?: number;
    total_volume?: number;
    avg_rating?: number;
    response_time?: string;
  } | null;
  created_at: string;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  realtor: { label: "Realtor", color: "bg-blue-500/15 text-blue-600 border-blue-500/20" },
  admin: { label: "Admin", color: "bg-purple-500/15 text-purple-600 border-purple-500/20" },
  manager: { label: "Manager", color: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  assistant: { label: "Assistant", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  marketing: { label: "Marketing", color: "bg-pink-500/15 text-pink-600 border-pink-500/20" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "realtor",
    title: "",
    license_number: "",
    commission_rate: "3.00",
    bio: "",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStaff((data as Staff[]) || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async () => {
    try {
      const { error } = await supabase.from("staff").insert([{
        first_name: newStaff.first_name,
        last_name: newStaff.last_name,
        email: newStaff.email,
        phone: newStaff.phone || null,
        role: newStaff.role as any,
        title: newStaff.title || null,
        license_number: newStaff.license_number || null,
        commission_rate: parseFloat(newStaff.commission_rate) || 3.0,
        bio: newStaff.bio || null,
        is_active: true,
      }]);

      if (error) throw error;

      toast.success("Staff member added successfully");
      setIsAddDialogOpen(false);
      setNewStaff({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "realtor",
        title: "",
        license_number: "",
        commission_rate: "3.00",
        bio: "",
      });
      fetchStaff();
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast.error(error.message || "Failed to add staff member");
    }
  };

  const toggleStaffStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("staff")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setStaff(staff.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s)));
      toast.success(`Staff member ${currentStatus ? "deactivated" : "activated"}`);
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const { error } = await supabase.from("staff").delete().eq("id", id);

      if (error) throw error;

      setStaff(staff.filter((s) => s.id !== id));
      toast.success("Staff member deleted");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff member");
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.is_active) ||
      (statusFilter === "inactive" && !member.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.is_active).length,
    realtors: staff.filter((s) => s.role === "realtor").length,
    avgCommission: staff.length > 0 
      ? (staff.reduce((acc, s) => acc + (s.commission_rate || 0), 0) / staff.length).toFixed(2)
      : "0.00",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-muted rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Team Management | {siteConfig.name}</title>
      </Helmet>

      <motion.div
        className="py-6 lg:py-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
                  <Users className="h-5 w-5" />
                </div>
                Team Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your realtors, staff, and team members
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                  <DialogDescription>
                    Add a new realtor or staff member to your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={newStaff.first_name}
                        onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        value={newStaff.last_name}
                        onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Select value={newStaff.role} onValueChange={(v) => setNewStaff({ ...newStaff, role: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtor">Realtor</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={newStaff.title}
                        onChange={(e) => setNewStaff({ ...newStaff, title: e.target.value })}
                        placeholder="Senior Agent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Commission Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newStaff.commission_rate}
                        onChange={(e) => setNewStaff({ ...newStaff, commission_rate: e.target.value })}
                        placeholder="3.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input
                      value={newStaff.license_number}
                      onChange={(e) => setNewStaff({ ...newStaff, license_number: e.target.value })}
                      placeholder="TX-123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={newStaff.bio}
                      onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })}
                      placeholder="Brief description..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addStaff} disabled={!newStaff.first_name || !newStaff.last_name || !newStaff.email}>
                    Add Team Member
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Team", value: stats.total, icon: Users, color: "from-blue-500 to-blue-600" },
              { label: "Active Members", value: stats.active, icon: UserCheck, color: "from-emerald-500 to-emerald-600" },
              { label: "Realtors", value: stats.realtors, icon: Briefcase, color: "from-amber-500 to-amber-600" },
              { label: "Avg Commission", value: `${stats.avgCommission}%`, icon: TrendingUp, color: "from-purple-500 to-purple-600" },
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
                      placeholder="Search team members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="realtor">Realtor</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Staff Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-accent to-accent/60" />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-accent/20">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                            {member.first_name[0]}{member.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {member.first_name} {member.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{member.title || "Team Member"}</p>
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
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleStaffStatus(member.id, member.is_active)}>
                            {member.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteStaff(member.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={roleConfig[member.role]?.color || "bg-muted"}>
                        {roleConfig[member.role]?.label || member.role}
                      </Badge>
                      <Badge variant={member.is_active ? "default" : "secondary"}>
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.license_number && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-3.5 w-3.5" />
                          <span>License: {member.license_number}</span>
                        </div>
                      )}
                    </div>

                    {member.role === "realtor" && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Performance</span>
                          <span className="font-medium text-foreground">
                            {member.performance_metrics?.listings_sold || 0} sales
                          </span>
                        </div>
                        <Progress value={Math.min((member.performance_metrics?.listings_sold || 0) * 10, 100)} className="h-2" />
                      </div>
                    )}

                    {member.commission_rate && (
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Commission Rate</span>
                        <span className="font-semibold text-accent">{member.commission_rate}%</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredStaff.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No team members found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first team member to get started"}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

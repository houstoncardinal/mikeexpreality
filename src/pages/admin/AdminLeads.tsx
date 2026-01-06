import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Search, Mail, Phone, Home, Eye } from "lucide-react";
import { LeadDetailModal } from "@/components/admin/LeadDetailModal";

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

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load leads");
      return;
    }

    setLeads(data || []);
    setLoading(false);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === "converted") {
      updates.converted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", leadId);

    if (error) {
      toast.error("Failed to update lead status");
      return;
    }

    setLeads(leads.map((lead) =>
      lead.id === leadId ? { ...lead, ...updates } : lead
    ));
    toast.success("Lead status updated");
  };

  const exportToCSV = () => {
    const filteredLeads = getFilteredLeads();
    
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Message",
      "Property",
      "Source",
      "Status",
      "Date",
    ];
    
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || "",
      (lead.message || "").replace(/"/g, '""'),
      lead.property_address || "",
      lead.lead_source || "",
      lead.status || "new",
      format(new Date(lead.created_at), "yyyy-MM-dd HH:mm"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast.success("CSV exported successfully");
  };

  const getFilteredLeads = () => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || (lead.status || "new") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredLeads = getFilteredLeads();

  const conversionRate =
    leads.length > 0
      ? Math.round(
          (leads.filter((l) => l.status === "converted").length / leads.length) * 100
        )
      : 0;

  return (
    <>
      <Helmet>
        <title>Manage Leads | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Leads</h1>
              <p className="text-muted-foreground mt-1">
                {leads.length} total leads • {conversionRate}% conversion rate
              </p>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Leads Table */}
          <Card>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No leads found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Contact
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Property
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Source
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">{lead.name}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </span>
                              {lead.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {lead.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {lead.property_address ? (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Home className="h-3 w-3" />
                              {lead.property_address}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-muted-foreground capitalize">
                            {lead.lead_source || "website"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Select
                            value={lead.status || "new"}
                            onValueChange={(value) => updateLeadStatus(lead.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {format(new Date(lead.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Lead Detail Modal */}
          {selectedLead && (
            <LeadDetailModal
              lead={selectedLead}
              onClose={() => setSelectedLead(null)}
              onUpdate={(updatedLead) => {
                setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
                setSelectedLead(updatedLead);
              }}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminLeads;

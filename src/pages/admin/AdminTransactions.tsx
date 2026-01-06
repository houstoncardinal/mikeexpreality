import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  DollarSign,
  Search,
  Plus,
  Calendar,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Building,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface Transaction {
  id: string;
  property_id: string | null;
  lead_id: string | null;
  listing_agent_id: string | null;
  buyer_agent_id: string | null;
  transaction_type: string;
  status: string;
  list_price: number | null;
  sale_price: number | null;
  commission_total: number | null;
  commission_listing_side: number | null;
  commission_buyer_side: number | null;
  contract_date: string | null;
  closing_date: string | null;
  escrow_company: string | null;
  title_company: string | null;
  lender: string | null;
  notes: string | null;
  milestones: any[];
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-600", icon: Clock },
  under_contract: { label: "Under Contract", color: "bg-blue-500/15 text-blue-600", icon: FileText },
  in_escrow: { label: "In Escrow", color: "bg-purple-500/15 text-purple-600", icon: Building },
  closed: { label: "Closed", color: "bg-emerald-500/15 text-emerald-600", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500/15 text-red-600", icon: XCircle },
  on_hold: { label: "On Hold", color: "bg-gray-500/15 text-gray-600", icon: AlertCircle },
};

const milestoneSteps = [
  "Offer Accepted",
  "Inspections Complete",
  "Appraisal Ordered",
  "Appraisal Complete",
  "Loan Approved",
  "Clear to Close",
  "Closing Scheduled",
  "Closed",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions((data as Transaction[]) || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("transactions").update({ status }).eq("id", id);

      if (error) throw error;

      setTransactions(transactions.map((t) => (t.id === id ? { ...t, status } : t)));
      toast.success("Transaction status updated");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);

      if (error) throw error;

      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success("Transaction deleted");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const filteredTransactions = transactions.filter((trans) => {
    const matchesSearch =
      trans.escrow_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.title_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || trans.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transactions.length,
    active: transactions.filter((t) => !["closed", "cancelled"].includes(t.status)).length,
    closed: transactions.filter((t) => t.status === "closed").length,
    totalVolume: transactions
      .filter((t) => t.status === "closed")
      .reduce((acc, t) => acc + (t.sale_price || 0), 0),
    totalCommission: transactions
      .filter((t) => t.status === "closed")
      .reduce((acc, t) => acc + (t.commission_total || 0), 0),
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const getMilestoneProgress = (milestones: any[]) => {
    if (!milestones || !Array.isArray(milestones)) return 0;
    const completedCount = milestones.filter((m: any) => m.completed).length;
    return Math.round((completedCount / milestoneSteps.length) * 100);
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
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Transactions | {siteConfig.name}</title>
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
                  <DollarSign className="h-5 w-5" />
                </div>
                Transaction Pipeline
              </h1>
              <p className="text-muted-foreground mt-1">
                Track deals from contract to closing
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Deals", value: stats.total, icon: FileText, color: "from-blue-500 to-blue-600" },
              { label: "Active", value: stats.active, icon: Clock, color: "from-amber-500 to-amber-600" },
              { label: "Closed", value: stats.closed, icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
              { label: "Volume", value: formatPrice(stats.totalVolume), icon: TrendingUp, color: "from-purple-500 to-purple-600" },
              { label: "Commission", value: formatPrice(stats.totalCommission), icon: DollarSign, color: "from-pink-500 to-pink-600" },
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
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_contract">Under Contract</SelectItem>
                      <SelectItem value="in_escrow">In Escrow</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions Table */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>List Price</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No transactions found
                        </h3>
                        <p className="text-muted-foreground">
                          Create your first transaction to track deals
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const StatusIcon = statusConfig[transaction.status]?.icon || Clock;
                      const progress = getMilestoneProgress(transaction.milestones);

                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                #{transaction.id.slice(0, 8).toUpperCase()}
                              </p>
                              {transaction.escrow_company && (
                                <p className="text-sm text-muted-foreground">
                                  {transaction.escrow_company}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {transaction.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusConfig[transaction.status]?.color || "bg-muted"}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[transaction.status]?.label || transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {transaction.list_price
                              ? `$${transaction.list_price.toLocaleString()}`
                              : "—"}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {transaction.sale_price
                              ? `$${transaction.sale_price.toLocaleString()}`
                              : "—"}
                          </TableCell>
                          <TableCell className="text-emerald-600 font-semibold">
                            {transaction.commission_total
                              ? `$${transaction.commission_total.toLocaleString()}`
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="w-24">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {transaction.closing_date
                              ? new Date(transaction.closing_date).toLocaleDateString()
                              : "TBD"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateTransactionStatus(transaction.id, "under_contract")}>
                                  Mark Under Contract
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTransactionStatus(transaction.id, "in_escrow")}>
                                  Mark In Escrow
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTransactionStatus(transaction.id, "closed")}>
                                  Mark Closed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => deleteTransaction(transaction.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

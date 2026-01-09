import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  User,
  Home,
  Heart,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Eye,
  MapPin,
  DollarSign,
  Clock,
  Phone,
  Mail,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  TrendingUp,
  Shield,
  ChevronRight,
  Plus,
  Upload,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ClientProperty {
  id: string;
  property_id: string;
  relationship_type: string;
  created_at: string;
  properties?: {
    id: string;
    title: string;
    address_line1: string;
    city: string;
    state: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    images: string[];
    status: string;
  };
}

interface ClientDocument {
  id: string;
  name: string;
  document_type: string;
  status: string;
  file_url: string | null;
  created_at: string;
  notes: string | null;
}

interface ClientTransaction {
  id: string;
  status: string;
  transaction_type: string;
  list_price: number | null;
  sale_price: number | null;
  contract_date: string | null;
  closing_date: string | null;
  milestones: any;
  properties?: {
    title: string;
    address_line1: string;
    city: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ClientPortal() {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState<ClientProperty[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [transactions, setTransactions] = useState<ClientTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/client-portal");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch saved properties
      const { data: propertiesData } = await supabase
        .from("client_properties")
        .select(`
          id,
          property_id,
          relationship_type,
          created_at,
          properties (
            id,
            title,
            address_line1,
            city,
            state,
            price,
            bedrooms,
            bathrooms,
            sqft,
            images,
            status
          )
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (propertiesData) {
        setProperties(propertiesData as unknown as ClientProperty[]);
      }

      // Fetch documents
      const { data: documentsData } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (documentsData) {
        setDocuments(documentsData);
      }

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from("transactions")
        .select(`
          id,
          status,
          transaction_type,
          list_price,
          sale_price,
          contract_date,
          closing_date,
          milestones,
          properties (
            title,
            address_line1,
            city
          )
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (transactionsData) {
        setTransactions(transactionsData as unknown as ClientTransaction[]);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Failed to load your data");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
      case "closed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "pending":
      case "in_review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTransactionProgress = (status: string): number => {
    const stages: Record<string, number> = {
      pending: 10,
      under_contract: 30,
      inspection: 45,
      appraisal: 60,
      financing: 75,
      final_walkthrough: 90,
      closed: 100,
    };
    return stages[status.toLowerCase()] || 20;
  };

  const documentTypeIcons: Record<string, string> = {
    contract: "📄",
    disclosure: "📋",
    inspection: "🔍",
    appraisal: "📊",
    title: "📑",
    loan: "💰",
    other: "📁",
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-secondary/20">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="text-muted-foreground font-medium">Loading your portal...</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Client";

  const stats = [
    {
      title: "Saved Properties",
      value: properties.length.toString(),
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-500/10 to-pink-600/5",
    },
    {
      title: "Active Transactions",
      value: transactions.filter((t) => t.status !== "closed").length.toString(),
      icon: TrendingUp,
      color: "from-accent to-amber-600",
      bgColor: "from-accent/10 to-amber-600/5",
    },
    {
      title: "Documents",
      value: documents.length.toString(),
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-500/10 to-indigo-600/5",
    },
    {
      title: "Completed",
      value: transactions.filter((t) => t.status === "closed").length.toString(),
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-500/10 to-teal-600/5",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Client Portal | {siteConfig.name}</title>
        <meta name="description" content="Access your properties, documents, and transaction progress" />
      </Helmet>

      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
          {/* Header */}
          <div className="bg-card border-b border-border shadow-sm">
            <div className="container-custom py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-accent/20">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-amber-600 text-white text-lg font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-foreground">
                      Welcome, {displayName}
                    </h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      Your secure client portal
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/listings">
                      <Home className="h-4 w-4 mr-2" />
                      Browse Properties
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container-custom py-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                {/* Tab Navigation */}
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
                  <TabsTrigger value="dashboard" className="py-2.5">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="py-2.5">
                    <Building2 className="h-4 w-4 mr-2" />
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="py-2.5">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="py-2.5">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard">
                  <motion.div variants={itemVariants} className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className={`relative overflow-hidden border-0 shadow-md bg-gradient-to-br ${stat.bgColor}`}>
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-10 translate-x-10`} />
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                    {stat.title}
                                  </p>
                                  <p className="text-3xl font-bold text-foreground">
                                    {stat.value}
                                  </p>
                                </div>
                                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                  <stat.icon className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Actions & Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Active Transactions Summary */}
                      <Card className="border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="h-5 w-5 text-accent" />
                            Active Transactions
                          </CardTitle>
                          <CardDescription>Your current real estate transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {transactions.filter((t) => t.status !== "closed").length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              <p>No active transactions</p>
                              <Button variant="link" asChild className="mt-2">
                                <Link to="/listings">Start browsing properties</Link>
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {transactions.filter((t) => t.status !== "closed").slice(0, 3).map((transaction) => (
                                <div key={transaction.id} className="p-4 rounded-lg bg-muted/50">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <p className="font-medium text-sm">
                                        {transaction.properties?.title || transaction.properties?.address_line1 || "Property Transaction"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {transaction.transaction_type === "sale" ? "Purchase" : "Sale"}
                                      </p>
                                    </div>
                                    <Badge className={getStatusColor(transaction.status)}>
                                      {transaction.status.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <Progress value={getTransactionProgress(transaction.status)} className="h-2" />
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Agent Contact */}
                      <Card className="border-0 shadow-md bg-gradient-to-br from-accent/5 to-accent/10">
                        <CardHeader>
                          <CardTitle className="text-lg">Your Agent</CardTitle>
                          <CardDescription>Get in touch with your dedicated agent</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16 ring-2 ring-accent/30">
                              <AvatarImage src="/logo-primary.jpeg" />
                              <AvatarFallback>MO</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-serif font-bold text-lg">
                                {siteConfig.agent.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                eXp Realty • Licensed Realtor
                              </p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="p-2 rounded-lg bg-accent/10">
                                <Phone className="h-4 w-4 text-accent" />
                              </div>
                              <span>{siteConfig.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="p-2 rounded-lg bg-accent/10">
                                <Mail className="h-4 w-4 text-accent" />
                              </div>
                              <span>{siteConfig.email}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" asChild>
                            <Link to="/contact">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Properties Tab */}
                <TabsContent value="properties">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-serif font-bold">My Properties</h2>
                        <p className="text-muted-foreground">Properties you're interested in or working with</p>
                      </div>
                      <Button asChild>
                        <Link to="/listings">
                          <Plus className="h-4 w-4 mr-2" />
                          Browse More
                        </Link>
                      </Button>
                    </div>

                    {properties.length === 0 ? (
                      <Card className="border-dashed border-2">
                        <CardContent className="py-16 text-center">
                          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                          <h3 className="font-semibold text-lg mb-2">No saved properties yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Start browsing and save properties you're interested in
                          </p>
                          <Button asChild>
                            <Link to="/listings">Browse Properties</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow">
                              <div className="aspect-[4/3] relative bg-muted">
                                {item.properties?.images?.[0] ? (
                                  <img
                                    src={item.properties.images[0]}
                                    alt={item.properties.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Building2 className="h-12 w-12 text-muted-foreground/30" />
                                  </div>
                                )}
                                <div className="absolute top-3 left-3">
                                  <Badge className={getStatusColor(item.properties?.status || "active")}>
                                    {item.properties?.status || "Active"}
                                  </Badge>
                                </div>
                                <div className="absolute top-3 right-3">
                                  <Badge variant="secondary" className="bg-white/90">
                                    <Heart className="h-3 w-3 mr-1 fill-rose-500 text-rose-500" />
                                    Saved
                                  </Badge>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <div className="mb-2">
                                  <p className="font-bold text-xl text-accent">
                                    ${item.properties?.price?.toLocaleString() || "N/A"}
                                  </p>
                                </div>
                                <p className="font-medium text-sm line-clamp-1 mb-1">
                                  {item.properties?.title || item.properties?.address_line1}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                                  <MapPin className="h-3 w-3" />
                                  {item.properties?.city}, {item.properties?.state}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{item.properties?.bedrooms || 0} beds</span>
                                  <span>{item.properties?.bathrooms || 0} baths</span>
                                  <span>{item.properties?.sqft?.toLocaleString() || 0} sqft</span>
                                </div>
                                <Separator className="my-3" />
                                <div className="flex gap-2">
                                  <Button size="sm" className="flex-1" asChild>
                                    <Link to={`/property/${item.property_id}`}>
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Link>
                                  </Button>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link to="/contact">
                                      <Calendar className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-serif font-bold">Transaction Progress</h2>
                      <p className="text-muted-foreground">Track your real estate transactions from contract to close</p>
                    </div>

                    {transactions.length === 0 ? (
                      <Card className="border-dashed border-2">
                        <CardContent className="py-16 text-center">
                          <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                          <h3 className="font-semibold text-lg mb-2">No transactions yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Your transaction progress will appear here once you start working with us
                          </p>
                          <Button asChild>
                            <Link to="/contact">Get Started</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((transaction) => (
                          <Card key={transaction.id} className="border-0 shadow-md overflow-hidden">
                            <div className={`h-1 bg-gradient-to-r ${
                              transaction.status === "closed" 
                                ? "from-emerald-500 to-teal-600" 
                                : "from-accent to-amber-600"
                            }`} />
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg">
                                      {transaction.properties?.title || transaction.properties?.address_line1 || "Property Transaction"}
                                    </h3>
                                    <Badge className={getStatusColor(transaction.status)}>
                                      {transaction.status.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {transaction.properties?.city || "N/A"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="h-3.5 w-3.5" />
                                      ${(transaction.sale_price || transaction.list_price || 0).toLocaleString()}
                                    </span>
                                    {transaction.closing_date && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Closing: {new Date(transaction.closing_date).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="lg:w-64">
                                  <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{getTransactionProgress(transaction.status)}%</span>
                                  </div>
                                  <Progress value={getTransactionProgress(transaction.status)} className="h-2" />
                                </div>
                              </div>

                              {/* Transaction Timeline */}
                              <div className="mt-6 pt-4 border-t border-border">
                                <p className="text-sm font-medium mb-3">Transaction Milestones</p>
                                <div className="flex flex-wrap gap-2">
                                  {["Contract", "Inspection", "Appraisal", "Financing", "Closing"].map((milestone, index) => {
                                    const progress = getTransactionProgress(transaction.status);
                                    const milestoneProgress = (index + 1) * 20;
                                    const isComplete = progress >= milestoneProgress;
                                    const isCurrent = progress >= milestoneProgress - 20 && progress < milestoneProgress;
                                    
                                    return (
                                      <Badge
                                        key={milestone}
                                        variant={isComplete ? "default" : "outline"}
                                        className={
                                          isComplete
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : isCurrent
                                            ? "bg-accent/10 text-accent border-accent"
                                            : ""
                                        }
                                      >
                                        {isComplete && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                        {milestone}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-serif font-bold">My Documents</h2>
                        <p className="text-muted-foreground">Access and download your transaction documents</p>
                      </div>
                    </div>

                    {documents.length === 0 ? (
                      <Card className="border-dashed border-2">
                        <CardContent className="py-16 text-center">
                          <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                          <h3 className="font-semibold text-lg mb-2">No documents yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Your transaction documents will appear here once available
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid gap-4">
                        {documents.map((doc) => (
                          <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="text-3xl">
                                    {documentTypeIcons[doc.document_type] || "📁"}
                                  </div>
                                  <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span className="capitalize">{doc.document_type.replace("_", " ")}</span>
                                      <span>•</span>
                                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge className={getStatusColor(doc.status)}>
                                    {doc.status}
                                  </Badge>
                                  {doc.file_url && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
}
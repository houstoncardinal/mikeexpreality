import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Home,
  Search,
  Plus,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Calendar,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";


interface Property {
  id: string;
  mls_number: string | null;
  title: string;
  description: string | null;
  property_type: string;
  status: string;
  price: number;
  original_price: number | null;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  year_built: number | null;
  images: string[] | null;
  listing_date: string | null;
  days_on_market: number | null;
  views_count: number;
  inquiries_count: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  sold: { label: "Sold", color: "bg-blue-500/15 text-blue-600 border-blue-500/20" },
  off_market: { label: "Off Market", color: "bg-gray-500/15 text-gray-600 border-gray-500/20" },
  coming_soon: { label: "Coming Soon", color: "bg-purple-500/15 text-purple-600 border-purple-500/20" },
};

const typeConfig: Record<string, string> = {
  single_family: "Single Family",
  condo: "Condo",
  townhouse: "Townhouse",
  multi_family: "Multi-Family",
  land: "Land",
  commercial: "Commercial",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "",
    mls_number: "",
    property_type: "single_family",
    status: "active",
    price: "",
    address_line1: "",
    city: "",
    state: "TX",
    zip_code: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    year_built: "",
    description: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties((data as Property[]) || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async () => {
    try {
      const { error } = await supabase.from("properties").insert([{
        title: newProperty.title,
        mls_number: newProperty.mls_number || null,
        property_type: newProperty.property_type as any,
        status: newProperty.status as any,
        price: parseFloat(newProperty.price),
        address_line1: newProperty.address_line1,
        city: newProperty.city,
        state: newProperty.state,
        zip_code: newProperty.zip_code,
        bedrooms: newProperty.bedrooms ? parseInt(newProperty.bedrooms) : null,
        bathrooms: newProperty.bathrooms ? parseFloat(newProperty.bathrooms) : null,
        sqft: newProperty.sqft ? parseInt(newProperty.sqft) : null,
        year_built: newProperty.year_built ? parseInt(newProperty.year_built) : null,
        description: newProperty.description || null,
        listing_date: new Date().toISOString().split("T")[0],
      }]);

      if (error) throw error;

      toast.success("Property added successfully");
      setIsAddDialogOpen(false);
      setNewProperty({
        title: "",
        mls_number: "",
        property_type: "single_family",
        status: "active",
        price: "",
        address_line1: "",
        city: "",
        state: "TX",
        zip_code: "",
        bedrooms: "",
        bathrooms: "",
        sqft: "",
        year_built: "",
        description: "",
      });
      fetchProperties();
    } catch (error: any) {
      console.error("Error adding property:", error);
      toast.error(error.message || "Failed to add property");
    }
  };

  const updatePropertyStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === "sold") {
        updateData.sold_date = new Date().toISOString().split("T")[0];
      }

      const { error } = await supabase.from("properties").update(updateData).eq("id", id);

      if (error) throw error;

      setProperties(properties.map((p) => (p.id === id ? { ...p, status } : p)));
      toast.success("Property status updated");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      setProperties(properties.filter((p) => p.id !== id));
      toast.success("Property deleted");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address_line1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.mls_number && prop.mls_number.includes(searchTerm));
    const matchesStatus = statusFilter === "all" || prop.status === statusFilter;
    const matchesType = typeFilter === "all" || prop.property_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: properties.length,
    active: properties.filter((p) => p.status === "active").length,
    pending: properties.filter((p) => p.status === "pending").length,
    totalValue: properties
      .filter((p) => p.status === "active")
      .reduce((acc, p) => acc + (p.price || 0), 0),
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-muted rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Properties | {siteConfig.name}</title>
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
                  <Home className="h-5 w-5" />
                </div>
                Property Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your property listings and inventory
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>
                      Add a new property listing to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Property Title *</Label>
                        <Input
                          value={newProperty.title}
                          onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                          placeholder="Beautiful 4BR Home in River Oaks"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>MLS Number</Label>
                        <Input
                          value={newProperty.mls_number}
                          onChange={(e) => setNewProperty({ ...newProperty, mls_number: e.target.value })}
                          placeholder="MLS-123456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Property Type *</Label>
                        <Select
                          value={newProperty.property_type}
                          onValueChange={(v) => setNewProperty({ ...newProperty, property_type: v })}
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
                      <div className="space-y-2">
                        <Label>Status *</Label>
                        <Select
                          value={newProperty.status}
                          onValueChange={(v) => setNewProperty({ ...newProperty, status: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="coming_soon">Coming Soon</SelectItem>
                            <SelectItem value="off_market">Off Market</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input
                        type="number"
                        value={newProperty.price}
                        onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                        placeholder="450000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Input
                        value={newProperty.address_line1}
                        onChange={(e) => setNewProperty({ ...newProperty, address_line1: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input
                          value={newProperty.city}
                          onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                          placeholder="Houston"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State *</Label>
                        <Input
                          value={newProperty.state}
                          onChange={(e) => setNewProperty({ ...newProperty, state: e.target.value })}
                          placeholder="TX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Code *</Label>
                        <Input
                          value={newProperty.zip_code}
                          onChange={(e) => setNewProperty({ ...newProperty, zip_code: e.target.value })}
                          placeholder="77002"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Bedrooms</Label>
                        <Input
                          type="number"
                          value={newProperty.bedrooms}
                          onChange={(e) => setNewProperty({ ...newProperty, bedrooms: e.target.value })}
                          placeholder="4"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bathrooms</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={newProperty.bathrooms}
                          onChange={(e) => setNewProperty({ ...newProperty, bathrooms: e.target.value })}
                          placeholder="3.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Sq Ft</Label>
                        <Input
                          type="number"
                          value={newProperty.sqft}
                          onChange={(e) => setNewProperty({ ...newProperty, sqft: e.target.value })}
                          placeholder="2500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year Built</Label>
                        <Input
                          type="number"
                          value={newProperty.year_built}
                          onChange={(e) => setNewProperty({ ...newProperty, year_built: e.target.value })}
                          placeholder="2020"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newProperty.description}
                        onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                        placeholder="Describe the property..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={addProperty}
                      disabled={
                        !newProperty.title ||
                        !newProperty.price ||
                        !newProperty.address_line1 ||
                        !newProperty.city ||
                        !newProperty.zip_code
                      }
                    >
                      Add Property
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Properties", value: stats.total, icon: Home, color: "from-blue-500 to-blue-600" },
              { label: "Active Listings", value: stats.active, icon: TrendingUp, color: "from-emerald-500 to-emerald-600" },
              { label: "Pending", value: stats.pending, icon: Calendar, color: "from-amber-500 to-amber-600" },
              { label: "Portfolio Value", value: formatPrice(stats.totalValue), icon: DollarSign, color: "from-purple-500 to-purple-600" },
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
                      placeholder="Search properties, MLS#, address..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="off_market">Off Market</SelectItem>
                      <SelectItem value="coming_soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="single_family">Single Family</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="multi_family">Multi-Family</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Properties Display */}
          {viewMode === "grid" ? (
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                      {property.images && property.images[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Home className="h-16 w-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className={statusConfig[property.status]?.color || "bg-muted"}>
                          {statusConfig[property.status]?.label || property.status}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8">
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
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Website
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updatePropertyStatus(property.id, "pending")}>
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updatePropertyStatus(property.id, "sold")}>
                              Mark as Sold
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteProperty(property.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xl font-bold text-accent">
                            ${property.price.toLocaleString()}
                          </p>
                          {property.mls_number && (
                            <p className="text-xs text-muted-foreground">MLS# {property.mls_number}</p>
                          )}
                        </div>
                        <Badge variant="outline">{typeConfig[property.property_type] || property.property_type}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">
                          {property.address_line1}, {property.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {property.bathrooms}
                          </span>
                        )}
                        {property.sqft && (
                          <span className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            {property.sqft.toLocaleString()} sqft
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-sm">
                        <span className="text-muted-foreground">
                          {property.views_count} views • {property.inquiries_count} inquiries
                        </span>
                        {property.days_on_market !== null && (
                          <span className="text-muted-foreground">
                            {property.days_on_market} DOM
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>MLS#</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {property.images && property.images[0] ? (
                                <img
                                  src={property.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Home className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{property.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {property.address_line1}, {property.city}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {property.mls_number || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {typeConfig[property.property_type] || property.property_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[property.status]?.color || "bg-muted"}>
                            {statusConfig[property.status]?.label || property.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${property.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {property.bedrooms}bd • {property.bathrooms}ba • {property.sqft?.toLocaleString() || "—"} sqft
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {property.views_count} views • {property.inquiries_count} inq
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
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteProperty(property.id)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}

          {filteredProperties.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-12">
              <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first property to get started"}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </motion.div>
          )}
        </motion.div>
    </>
  );
}

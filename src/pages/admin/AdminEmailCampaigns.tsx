import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Mail,
  Send,
  FileText,
  Users,
  TrendingUp,
  MousePointer,
  Eye,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused";
  type: "newsletter" | "drip" | "announcement" | "listing" | "market_update";
  audience: string;
  audienceCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  usageCount: number;
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-500/10 text-gray-600 border-gray-500/20", icon: FileText },
  scheduled: { label: "Scheduled", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Calendar },
  sending: { label: "Sending", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Send },
  sent: { label: "Sent", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  paused: { label: "Paused", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: Pause },
};

const typeConfig = {
  newsletter: { label: "Newsletter", color: "bg-purple-500" },
  drip: { label: "Drip Campaign", color: "bg-blue-500" },
  announcement: { label: "Announcement", color: "bg-amber-500" },
  listing: { label: "New Listing", color: "bg-emerald-500" },
  market_update: { label: "Market Update", color: "bg-indigo-500" },
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
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "January Market Update",
    subject: "Houston Real Estate Market Report - January 2024",
    status: "sent",
    type: "market_update",
    audience: "All Subscribers",
    audienceCount: 2847,
    sentCount: 2847,
    openRate: 42.3,
    clickRate: 8.7,
    unsubscribeRate: 0.2,
    scheduledAt: null,
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "New Listing: Riverstone Estate",
    subject: "🏡 Just Listed: Stunning 5BR Home in Riverstone",
    status: "scheduled",
    type: "listing",
    audience: "Buyers - Sugar Land",
    audienceCount: 892,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Buyer Welcome Drip - Day 1",
    subject: "Welcome! Your Home Buying Journey Starts Here",
    status: "sending",
    type: "drip",
    audience: "New Buyer Leads",
    audienceCount: 156,
    sentCount: 89,
    openRate: 67.4,
    clickRate: 23.5,
    unsubscribeRate: 0.1,
    scheduledAt: null,
    sentAt: null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Monthly Newsletter - February",
    subject: "February Newsletter: Spring Market Insights",
    status: "draft",
    type: "newsletter",
    audience: "All Subscribers",
    audienceCount: 2934,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    scheduledAt: null,
    sentAt: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    name: "Open House Announcement",
    subject: "🎉 You're Invited: Open House This Weekend",
    status: "sent",
    type: "announcement",
    audience: "Buyers - Memorial",
    audienceCount: 445,
    sentCount: 445,
    openRate: 38.9,
    clickRate: 15.2,
    unsubscribeRate: 0.4,
    scheduledAt: null,
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockTemplates: Template[] = [
  { id: "1", name: "New Listing Showcase", category: "Listings", thumbnail: "/placeholder.svg", usageCount: 47 },
  { id: "2", name: "Market Update", category: "Reports", thumbnail: "/placeholder.svg", usageCount: 23 },
  { id: "3", name: "Welcome Series", category: "Automation", thumbnail: "/placeholder.svg", usageCount: 156 },
  { id: "4", name: "Open House Invitation", category: "Events", thumbnail: "/placeholder.svg", usageCount: 34 },
  { id: "5", name: "Monthly Newsletter", category: "Newsletter", thumbnail: "/placeholder.svg", usageCount: 12 },
  { id: "6", name: "Price Reduction Alert", category: "Listings", thumbnail: "/placeholder.svg", usageCount: 28 },
];

export default function AdminEmailCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [templates] = useState<Template[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("campaigns");

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalCampaigns: campaigns.length,
    totalSent: campaigns.reduce((acc, c) => acc + c.sentCount, 0),
    avgOpenRate: campaigns.filter(c => c.status === "sent").reduce((acc, c) => acc + c.openRate, 0) /
      Math.max(campaigns.filter(c => c.status === "sent").length, 1),
    avgClickRate: campaigns.filter(c => c.status === "sent").reduce((acc, c) => acc + c.clickRate, 0) /
      Math.max(campaigns.filter(c => c.status === "sent").length, 1),
    subscribers: 2934,
    growthRate: 12.4,
  };

  const duplicateCampaign = (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      const newCampaign = {
        ...campaign,
        id: Date.now().toString(),
        name: `${campaign.name} (Copy)`,
        status: "draft" as const,
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        scheduledAt: null,
        sentAt: null,
        createdAt: new Date().toISOString(),
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      toast.success("Campaign duplicated");
    }
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success("Campaign deleted");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Helmet>
        <title>Email Campaigns | {siteConfig.name}</title>
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
                <Mail className="h-5 w-5" />
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
                  Email Campaigns
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create and manage email marketing campaigns
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Writer
            </Button>
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-white shadow-lg">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Campaigns", value: stats.totalCampaigns, icon: FileText, color: "from-blue-500 to-indigo-600" },
            { label: "Emails Sent", value: stats.totalSent.toLocaleString(), icon: Send, color: "from-emerald-500 to-teal-600" },
            { label: "Subscribers", value: stats.subscribers.toLocaleString(), icon: Users, color: "from-purple-500 to-pink-600" },
            { label: "Avg Open Rate", value: `${stats.avgOpenRate.toFixed(1)}%`, icon: Eye, color: "from-amber-500 to-orange-600" },
            { label: "Avg Click Rate", value: `${stats.avgClickRate.toFixed(1)}%`, icon: MousePointer, color: "from-cyan-500 to-blue-600" },
            { label: "List Growth", value: `+${stats.growthRate}%`, icon: TrendingUp, color: "from-rose-500 to-red-600" },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="campaigns" className="gap-2">
                <Mail className="h-4 w-4" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <FileText className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="automation" className="gap-2">
                <Zap className="h-4 w-4" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="audiences" className="gap-2">
                <Users className="h-4 w-4" />
                Audiences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="mt-6 space-y-4">
              {/* Filters */}
              <Card className="border-0 shadow-lg bg-card/80">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search campaigns..."
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
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="sending">Sending</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Campaigns List */}
              <div className="space-y-4">
                {filteredCampaigns.map((campaign) => {
                  const StatusIcon = statusConfig[campaign.status].icon;
                  return (
                    <motion.div
                      key={campaign.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-0 shadow-lg bg-card/80 hover:shadow-xl transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Campaign Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={typeConfig[campaign.type].color + " text-white text-[10px]"}>
                                  {typeConfig[campaign.type].label}
                                </Badge>
                                <Badge className={statusConfig[campaign.status].color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[campaign.status].label}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg mb-1">{campaign.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{campaign.subject}</p>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>{campaign.audienceCount.toLocaleString()} recipients</span>
                                </div>
                                {campaign.scheduledAt && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Scheduled: {formatDate(campaign.scheduledAt)}</span>
                                  </div>
                                )}
                                {campaign.sentAt && (
                                  <div className="flex items-center gap-1">
                                    <Send className="h-3.5 w-3.5" />
                                    <span>Sent: {formatDate(campaign.sentAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Stats */}
                            {campaign.status === "sent" && (
                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-emerald-500">{campaign.openRate}%</p>
                                  <p className="text-[10px] text-muted-foreground uppercase">Open Rate</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-blue-500">{campaign.clickRate}%</p>
                                  <p className="text-[10px] text-muted-foreground uppercase">Click Rate</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-semibold text-muted-foreground">{campaign.sentCount.toLocaleString()}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase">Delivered</p>
                                </div>
                              </div>
                            )}

                            {/* Progress for sending */}
                            {campaign.status === "sending" && (
                              <div className="w-48">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Sending...</span>
                                  <span>{Math.round((campaign.sentCount / campaign.audienceCount) * 100)}%</span>
                                </div>
                                <Progress value={(campaign.sentCount / campaign.audienceCount) * 100} className="h-2" />
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <BarChart3 className="h-4 w-4" />
                                <span className="hidden xl:inline">Analytics</span>
                              </Button>
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
                                  <DropdownMenuItem onClick={() => duplicateCampaign(campaign.id)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() => deleteCampaign(campaign.id)}
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

                {filteredCampaigns.length === 0 && (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No campaigns found</p>
                    <Button className="mt-4 gap-2" variant="outline">
                      <Plus className="h-4 w-4" />
                      Create Your First Campaign
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg bg-card/80 hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="text-[10px] mb-2">{template.category}</Badge>
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">Used {template.usageCount} times</p>
                        <div className="flex items-center gap-2 mt-4">
                          <Button size="sm" className="flex-1 gap-1">
                            <Edit className="h-3.5 w-3.5" />
                            Use Template
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Add Template Card */}
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="border-2 border-dashed border-muted hover:border-accent/50 transition-colors h-full min-h-[280px] flex items-center justify-center cursor-pointer">
                    <CardContent className="text-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">Create Template</p>
                      <p className="text-sm text-muted-foreground mt-1">Design a new email template</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              <Card className="border-0 shadow-lg bg-card/80">
                <CardContent className="p-12 text-center">
                  <Zap className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Email Automation</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Set up automated email sequences to nurture leads, welcome new subscribers, and keep in touch with past clients.
                  </p>
                  <Button className="gap-2 bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4" />
                    Create Automation
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audiences" className="mt-6">
              <Card className="border-0 shadow-lg bg-card/80">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Audience Segments</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Create targeted audience segments based on lead source, property interest, location, and engagement history.
                  </p>
                  <Button className="gap-2 bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4" />
                    Create Segment
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </>
  );
}
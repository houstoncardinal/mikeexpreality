import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  LogOut,
  Home,
  Settings,
  HelpCircle,
  Bell,
  Building2,
  DollarSign,
  Calendar,
  GraduationCap,
  Link2,
  BarChart3,
  CheckSquare,
  Handshake,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  PieChart,
  Target,
  MessageSquare,
  Megaphone,
  Clock,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface AdminSidebarProps {
  collapsed: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge: string | null;
  description?: string;
  highlight?: boolean;
}

const navigation: NavItem[] = [
  { 
    name: "Dashboard", 
    href: "/admin", 
    icon: LayoutDashboard, 
    badge: null,
    description: "Overview & analytics"
  },
  { 
    name: "Leads", 
    href: "/admin/leads", 
    icon: Users, 
    badge: "12",
    description: "Manage inquiries"
  },
  { 
    name: "Properties", 
    href: "/admin/properties", 
    icon: Building2, 
    badge: "24",
    description: "Active listings"
  },
  { 
    name: "Transactions", 
    href: "/admin/transactions", 
    icon: DollarSign, 
    badge: "3",
    description: "Revenue & deals"
  },
  { 
    name: "Showings", 
    href: "/admin/showings", 
    icon: Calendar, 
    badge: "5",
    description: "Schedule & tours"
  },
  { 
    name: "Tasks", 
    href: "/admin/tasks", 
    icon: CheckSquare, 
    badge: "8",
    description: "To-do & follow-ups"
  },
  { 
    name: "Follow-Ups", 
    href: "/admin/follow-ups", 
    icon: Bell, 
    badge: "6",
    description: "Lead nurturing",
    highlight: true
  },
  { 
    name: "Email Campaigns", 
    href: "/admin/email-campaigns", 
    icon: Megaphone, 
    badge: null,
    description: "Marketing automation"
  },
];

const analyticsNavigation: NavItem[] = [
  { 
    name: "Reports", 
    href: "/admin/reports", 
    icon: BarChart3, 
    badge: null,
    description: "Performance analytics"
  },
  { 
    name: "Monitoring", 
    href: "/admin/monitoring", 
    icon: Activity, 
    badge: null,
    description: "Health & webhooks",
    highlight: true
  },
  { 
    name: "SEO Audit", 
    href: "/admin/seo", 
    icon: Target, 
    badge: null,
    description: "Schema & sitemap health",
  },
  { 
    name: "MLS Integration", 
    href: "/admin/mls", 
    icon: Link2, 
    badge: null,
    description: "eXp Realty sync",
  },
];

const teamNavigation: NavItem[] = [
  { name: "Staff", href: "/admin/staff", icon: Handshake, badge: null, description: "Team management" },
  { name: "Meetings", href: "/admin/meetings", icon: MessageSquare, badge: null, description: "Sync meetings" },
  { name: "Trainings", href: "/admin/trainings", icon: GraduationCap, badge: "2", description: "eXp University" },
];

const contentNavigation: NavItem[] = [
  { name: "Blog Posts", href: "/admin/posts", icon: FileText, badge: null, description: "Manage articles" },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen, badge: null, description: "Organize content" },
];

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(["operations", "analytics"]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const currentHour = currentTime.getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  const NavItemComponent = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
    const content = (
      <Link
        to={item.href}
        onMouseEnter={() => setHoveredItem(item.name)}
        onMouseLeave={() => setHoveredItem(null)}
        className={cn(
          "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group",
          isActive
            ? "bg-gradient-to-r from-accent/20 to-accent/10 text-white shadow-lg"
            : "text-white/60 hover:bg-white/5 hover:text-white",
          item.highlight && !isActive && "ring-1 ring-accent/30"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <div className={cn(
          "p-2 rounded-lg transition-all duration-300 shrink-0",
          isActive 
            ? "bg-accent text-white shadow-lg shadow-accent/30" 
            : "bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white"
        )}>
          <item.icon className="h-4 w-4" />
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <span className="block">{item.name}</span>
              <AnimatePresence>
                {hoveredItem === item.name && !isActive && item.description && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="block text-[10px] text-white/40"
                  >
                    {item.description}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {item.badge && (
              <Badge
                className={cn(
                  "text-[10px] px-2 py-0.5 font-semibold",
                  isActive
                    ? "bg-white/20 text-white border-0"
                    : "bg-accent/20 text-accent border-accent/30"
                )}
              >
                {item.badge}
              </Badge>
            )}
            {item.highlight && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-3.5 w-3.5 text-accent" />
              </motion.div>
            )}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>{item.name}</span>
              {item.badge && <Badge variant="secondary" className="text-xs">{item.badge}</Badge>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  const SectionHeader = ({ 
    title, 
    section, 
    icon: Icon 
  }: { 
    title: string; 
    section: string; 
    icon: React.ElementType;
  }) => {
    if (collapsed) return null;
    
    return (
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" />
          <span>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: expandedSections.includes(section) ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      </button>
    );
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 shadow-2xl overflow-hidden transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className={cn(
          "border-b border-white/10 transition-all",
          collapsed ? "p-3" : "p-5"
        )}>
          <Link to="/admin" className="flex items-center gap-3 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-accent/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src="/logo-primary.jpeg"
                alt="Mike Ogunkeye Real Estate"
                className={cn(
                  "rounded-xl object-cover shadow-lg ring-2 ring-white/20 transition-all",
                  collapsed ? "w-12 h-12" : "w-11 h-11"
                )}
              />
            </motion.div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="font-serif font-bold text-white text-lg">Mike Ogunkeye</p>
                <p className="text-xs text-white/50 font-medium">eXp Realty CRM</p>
              </motion.div>
            )}
          </Link>
        </div>

        {/* User Profile - Only shown when expanded */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 mt-4"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center shadow-lg ring-2 ring-white/20">
                      <span className="text-white font-bold text-sm">
                        {user?.email?.charAt(0).toUpperCase() || "M"}
                      </span>
                    </div>
                    <motion.div
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50">{greeting},</p>
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.email?.split("@")[0] || "Mike"}
                    </p>
                  </div>
                </div>

                {/* Performance Widget */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Monthly Goal</span>
                    <span className="text-xs font-semibold text-white">72%</span>
                  </div>
                  <Progress value={72} className="h-1.5" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-white/50">$847K / $1.2M</span>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-[10px] font-medium">+18%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats - Collapsed only */}
        <AnimatePresence>
          {collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 py-4 space-y-2"
            >
              {[
                { value: "12", color: "from-blue-500 to-blue-600" },
                { value: "24", color: "from-emerald-500 to-emerald-600" },
                { value: "5", color: "from-amber-500 to-amber-600" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-2 rounded-lg bg-white/5 text-center cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <p className={`text-sm font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {/* Operations Section */}
          <SectionHeader title="Operations" section="operations" icon={Activity} />
          <AnimatePresence>
            {(collapsed || expandedSections.includes("operations")) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {navigation.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <NavItemComponent item={item} isActive={isActive} />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && <Separator className="my-3 bg-white/10" />}

          {/* Analytics Section */}
          <SectionHeader title="Analytics" section="analytics" icon={PieChart} />
          <AnimatePresence>
            {(collapsed || expandedSections.includes("analytics")) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {analyticsNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return <NavItemComponent key={item.name} item={item} isActive={isActive} />;
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && <Separator className="my-3 bg-white/10" />}

          {/* Team Section */}
          <SectionHeader title="Team" section="team" icon={Handshake} />
          <AnimatePresence>
            {(collapsed || expandedSections.includes("team")) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {teamNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return <NavItemComponent key={item.name} item={item} isActive={isActive} />;
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && <Separator className="my-3 bg-white/10" />}

          {/* Content Section */}
          <SectionHeader title="Content" section="content" icon={FileText} />
          <AnimatePresence>
            {(collapsed || expandedSections.includes("content")) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {contentNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return <NavItemComponent key={item.name} item={item} isActive={isActive} />;
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Live Activity Ticker - Only when expanded */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pb-3"
            >
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  </motion.div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">Live Activity</span>
                </div>
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs text-white/60"
                  >
                    <Star className="h-3 w-3 text-amber-400" />
                    <span className="truncate">New lead: Sarah M.</span>
                    <span className="text-[10px] text-white/40 ml-auto">2m</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 text-xs text-white/60"
                  >
                    <Calendar className="h-3 w-3 text-blue-400" />
                    <span className="truncate">Showing confirmed</span>
                    <span className="text-[10px] text-white/40 ml-auto">15m</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className={cn(
          "border-t border-white/10 space-y-2",
          collapsed ? "p-2" : "p-4"
        )}>
          {collapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full h-10 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Home className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">View Website</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-10 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white"
                >
                  <Home className="h-4 w-4" />
                  View Website
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

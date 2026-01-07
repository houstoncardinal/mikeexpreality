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
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const navigation = [
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
    name: "MLS Integration", 
    href: "/admin/mls", 
    icon: Link2, 
    badge: null,
    description: "eXp Realty sync",
    highlight: true
  },
  { 
    name: "Tasks", 
    href: "/admin/tasks", 
    icon: CheckSquare, 
    badge: "8",
    description: "To-do & follow-ups"
  },
  { 
    name: "Staff", 
    href: "/admin/staff", 
    icon: Handshake, 
    badge: null,
    description: "Team management"
  },
];

const contentNavigation = [
  { name: "Blog Posts", href: "/admin/posts", icon: FileText, badge: null },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen, badge: null },
];

const secondaryNavigation = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Help Center", href: "/admin/help", icon: HelpCircle },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>("main");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5 shadow-2xl overflow-hidden">
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
        <div className="p-5 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-accent/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-11 h-11 bg-gradient-to-br from-accent via-amber-500 to-accent rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </motion.div>
            <div>
              <p className="font-serif font-bold text-white text-lg">M.O.R.E.</p>
              <p className="text-xs text-white/50 font-medium">Admin Console</p>
            </div>
          </Link>
        </div>

        {/* User Profile */}
        <motion.div 
          className="p-4 mx-3 mt-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
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
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-white/50 hover:text-white hover:bg-white/10 relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 px-4 mt-4">
          {[
            { label: "Leads", value: "12", color: "from-blue-500 to-blue-600" },
            { label: "Active", value: "24", color: "from-emerald-500 to-emerald-600" },
            { label: "Pending", value: "5", color: "from-amber-500 to-amber-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              <p className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {/* Main Section */}
          <button
            onClick={() => setExpandedSection(expandedSection === "main" ? null : "main")}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
          >
            <span>Operations</span>
            <motion.div
              animate={{ rotate: expandedSection === "main" ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedSection === "main" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {navigation.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  const isHovered = hoveredItem === item.name;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
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
                          "p-2 rounded-lg transition-all duration-300",
                          isActive 
                            ? "bg-accent text-white shadow-lg shadow-accent/30" 
                            : "bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block">{item.name}</span>
                          <AnimatePresence>
                            {isHovered && !isActive && (
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
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <Separator className="my-3 bg-white/10" />

          {/* Content Section */}
          <p className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
            Content
          </p>
          {contentNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isActive ? "bg-white/10" : "bg-white/5"
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}

          <Separator className="my-3 bg-white/10" />

          {/* Support Section */}
          <p className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
            Support
          </p>
          {secondaryNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isActive ? "bg-white/10" : "bg-white/5"
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
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
        </div>
      </div>
    </aside>
  );
}
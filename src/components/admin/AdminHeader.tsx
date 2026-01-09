import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Command, 
  Sparkles,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Keyboard,
  MessageSquare,
  Activity,
  Zap,
  Plus,
  FileText,
  Home,
  Users,
  Calendar,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function AdminHeader({ onToggleSidebar, sidebarCollapsed }: AdminHeaderProps) {
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState([
    { id: 1, title: "New lead from Zillow", time: "2 min ago", unread: true, type: "lead" },
    { id: 2, title: "Showing confirmed for 2:00 PM", time: "15 min ago", unread: true, type: "calendar" },
    { id: 3, title: "Contract signed - 4521 Riverstone", time: "1 hour ago", unread: false, type: "success" },
    { id: 4, title: "MLS sync completed", time: "2 hours ago", unread: false, type: "system" },
  ]);

  const quickActions = [
    { icon: Users, label: "Add Lead", shortcut: "⌘L" },
    { icon: Building2, label: "New Listing", shortcut: "⌘P" },
    { icon: Calendar, label: "Schedule", shortcut: "⌘S" },
    { icon: FileText, label: "Create Task", shortcut: "⌘T" },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <motion.button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1">
              <motion.span
                className="block h-0.5 bg-foreground rounded-full origin-center"
                animate={{ 
                  width: sidebarCollapsed ? 20 : 16,
                  rotate: sidebarCollapsed ? 0 : 0
                }}
              />
              <motion.span
                className="block h-0.5 bg-foreground rounded-full"
                animate={{ width: sidebarCollapsed ? 12 : 20 }}
              />
              <motion.span
                className="block h-0.5 bg-foreground rounded-full origin-center"
                animate={{ 
                  width: sidebarCollapsed ? 20 : 12,
                  rotate: sidebarCollapsed ? 0 : 0
                }}
              />
            </div>
          </motion.button>

          {/* Command Search */}
          <div className="relative hidden md:block">
            <motion.div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer",
                searchOpen 
                  ? "w-80 bg-background border-accent/50 shadow-lg shadow-accent/10" 
                  : "w-64 bg-muted/50 border-border/50 hover:border-border hover:bg-muted"
              )}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search leads, properties, tasks..."
                      className="h-6 border-0 p-0 bg-transparent focus-visible:ring-0 text-sm"
                      autoFocus
                      onBlur={() => !searchQuery && setSearchOpen(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    Search anything...
                  </motion.span>
                )}
              </AnimatePresence>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </motion.div>
          </div>
        </div>

        {/* Center - Quick Actions */}
        <div className="hidden xl:flex items-center gap-1">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden 2xl:inline">{action.label}</span>
            </motion.button>
          ))}
          <Button size="sm" className="ml-2 gap-1 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25">
            <Plus className="h-4 w-4" />
            <span className="hidden 2xl:inline">Quick Add</span>
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Activity Indicator */}
          <motion.div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          </motion.div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                  <div className={cn(
                    "mt-0.5 h-2 w-2 rounded-full shrink-0",
                    notification.unread ? "bg-accent" : "bg-transparent"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm truncate",
                      notification.unread ? "font-medium" : "text-muted-foreground"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-accent cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hidden lg:flex">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2 rounded-lg">
                <Avatar className="h-7 w-7 ring-2 ring-accent/20">
                  <AvatarFallback className="bg-gradient-to-br from-accent to-amber-600 text-white text-xs font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || "M"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium leading-none">
                    {user?.email?.split("@")[0] || "Admin"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Administrator</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard shortcuts
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  View Website
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, badge: null },
  { name: "Leads", href: "/admin/leads", icon: Users, badge: "12" },
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

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-card via-card to-card/95 border-r border-border/50 shadow-xl">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-5 border-b border-border/50">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-accent/25 transition-shadow">
              <span className="text-accent-foreground font-bold text-sm">HE</span>
            </div>
            <div>
              <p className="font-serif font-bold text-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Houston Elite</p>
            </div>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 mx-3 mt-4 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-md">
              <span className="text-accent-foreground font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email?.split("@")[0] || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-accent-foreground")} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className={cn(
                      "text-xs px-2 py-0.5",
                      isActive
                        ? "bg-accent-foreground/20 text-accent-foreground border-0"
                        : "bg-accent/10 text-accent border-accent/20"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          <Separator className="my-4" />

          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Support
          </p>
          {secondaryNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <Link to="/">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-background/50 hover:bg-background border-border/50"
            >
              <Home className="h-4 w-4" />
              View Website
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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

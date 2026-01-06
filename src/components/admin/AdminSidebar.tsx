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
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Blog Posts", href: "/admin/posts", icon: FileText },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">HE</span>
            </div>
            <div>
              <p className="font-serif font-bold text-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Houston Elite</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              View Site
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}

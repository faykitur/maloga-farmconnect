import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Store, MapPin, MessageSquare, Video, BookOpen, Bell, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    setIsAdmin(roles?.some((r) => r.role === "superadmin") || false);
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/marketplace", icon: Store, label: "Marketplace" },
    { path: "/slaughterhouses", icon: MapPin, label: "Slaughterhouses" },
    { path: "/forum", icon: MessageSquare, label: "Forum" },
    { path: "/videos", icon: Video, label: "Videos" },
    { path: "/education", icon: BookOpen, label: "Education" },
  ];

  const mockNotifications = [
    "New answer posted in your Q&A thread",
    "Your video got 10 likes",
    "New listing in your area",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">M</span>
              </div>
              <span className="text-xl font-bold text-primary">MALOGA</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Dashboard */}
            {isAdmin && (
              <Link to="/admin">
                <Button 
                  variant={location.pathname === "/admin" ? "default" : "ghost"} 
                  size="icon" 
                  title="Admin Dashboard"
                >
                  <Shield className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {mockNotifications.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockNotifications.map((notification, i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer">
                    {notification}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-card">
        <div className="flex items-center justify-around p-2">
          {navItems.slice(0, 5).map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="icon"
                className="h-12 w-12"
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
};

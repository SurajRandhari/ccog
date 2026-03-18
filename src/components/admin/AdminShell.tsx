"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  Music,
  Download,
  Newspaper,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  User,
  Users,
  MessageSquare,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Songs", href: "/admin/songs", icon: Music },
  { name: "Sermons", href: "/admin/sermons", icon: Video },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Blog", href: "/admin/blog", icon: Newspaper },
  { name: "Activity Logs", href: "/admin/logs", icon: Shield, adminOnly: true },
  { name: "Prayer Requests", href: "/admin/prayer-requests", icon: MessageSquare },
  { name: "User Management", href: "/admin/users", icon: Users, adminOnly: true },
  { name: "Devotions", href: "/admin/devotions", icon: BookOpen },
  { name: "Downloads", href: "/admin/downloads", icon: Download },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // In a real app, this would be in a context provider.
    // For now, we'll fetch basic info to handle UI roles.
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/admin/me"); // We'll need to create this simple route
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const filteredNavItems = navItems.filter(item => !item.adminOnly || user?.role === "admin");

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50/50">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-72 flex-col border-r border-neutral-200 bg-white lg:flex sticky top-0 h-screen overflow-y-auto">
        <div className="flex h-16 items-center border-b border-neutral-100 px-8">
          <Link href="/admin" className="font-serif text-xl font-bold text-neutral-900">
            Calvary Admin
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-neutral-900 text-white shadow-lg shadow-neutral-200"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-neutral-400")} />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    <ChevronRight className="h-4 w-4 text-white/50" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-neutral-100 p-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="lg:hidden" />}
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex h-16 items-center border-b border-neutral-100 px-8">
                  <span className="font-serif text-xl font-bold text-neutral-900">Calvary Admin</span>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                          isActive
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-500 hover:bg-neutral-100"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                  <div className="mt-auto border-t border-neutral-100 p-4">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start gap-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-neutral-900 md:flex">
              <Search className="h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5 text-neutral-500" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
            <div className="h-8 w-px bg-neutral-200" />
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-neutral-900">Admin</p>
                <p className="text-xs text-neutral-400">Manage Site</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
                <User className="h-5 w-5 text-neutral-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  Users,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Calendar,
  Inbox,
  Users,
  Sparkles,
  User,
};

interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  basePath: string;
}

export function DashboardLayout({ children, navItems, basePath }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full bg-card shadow-md"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/" className="text-xl font-display font-bold text-primary">
              GlamStudio
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 min-h-screen">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
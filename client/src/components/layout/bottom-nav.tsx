import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTaskNotifications } from "@/hooks/use-task-notifications";
import { Home, MessageSquare, Gavel, FileText } from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();
  const { unseenTasksCount } = useTaskNotifications();

  console.log('BottomNav rendering:', { location, unseenTasksCount });

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-6 w-6" />,
      active: location === "/"
    },
    {
      label: "All Services",
      href: "/vakilsutra",
      icon: <Gavel className="h-6 w-6" />,
      active: location === "/vakilsutra"
    },
    {
      label: "Tickets",
      href: "/tickets",
      icon: <FileText className="h-6 w-6" />,
      active: location === "/tickets",
      badge: unseenTasksCount > 0 ? unseenTasksCount : undefined
    },
    {
      label: "Consult",
      href: "/consult",
      icon: <MessageSquare className="h-6 w-6" />,
      active: location === "/consult"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#002B4E] border-t border-[#002B4E]">
      <div className="h-20 grid grid-cols-4 text-white">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-2",
              item.active ? "text-primary" : "text-white"
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
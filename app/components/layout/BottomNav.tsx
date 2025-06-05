"use client";

import { Home, Search, Plus, Activity, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "HOME", href: "/" },
  { icon: Search, label: "BROWSE", href: "/browse" },
  { icon: Plus, label: "LIST", href: "/list" },
  { icon: Activity, label: "ACTIVITY", href: "/activity" },
  { icon: User, label: "PROFILE", href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-brutal border-brutal-black shadow-brutal z-50">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-150",
                isActive
                  ? "bg-farcaster-500 text-white"
                  : "text-brutal-black hover:bg-gray-100",
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-brutal-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

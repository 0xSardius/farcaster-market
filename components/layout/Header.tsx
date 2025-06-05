"use client";

import { Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { dbUser } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-white border-b-brutal border-brutal-black shadow-brutal">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-farcaster-500 border-brutal border-brutal-black shadow-brutal-sm"></div>
          <h1 className="text-brutal-title text-lg">
            FARCASTER
            <br />
            MARKET
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH NFTS..."
              className="input-brutal w-full pr-12 placeholder:text-gray-500 placeholder:uppercase"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-2">
          {dbUser ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brutal-yellow border-brutal border-brutal-black shadow-brutal-sm rounded-none flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-brutal-sm hidden sm:block">
                {dbUser.username}
              </span>
            </div>
          ) : (
            <Button size="sm">CONNECT</Button>
          )}
        </div>
      </div>
    </header>
  );
}

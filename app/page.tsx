"use client";

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Home as HomeIcon, Grid3X3, Plus, User } from "lucide-react";
import NFTGrid from "@/components/nft/NFTGrid";
import { useMarketplace } from "@/hooks/useMarketplace";
import Link from "next/link";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { isConnected } = useAccount();
  const { dbUser, isLoading, isWalletConnecting } = useUser();
  const { listings, listingsLoading } = useMarketplace();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary border-2 border-black shadow-brutal"></div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight">
                FARCASTER
              </h1>
              <p className="text-sm font-black uppercase -mt-1">MARKET</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isLoading || isWalletConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-muted animate-pulse border-2 border-black rounded-full"></div>
                <div className="text-xs font-black uppercase text-gray-500">
                  {isWalletConnecting ? "CONNECTING..." : "LOADING..."}
                </div>
              </div>
            ) : dbUser ? (
              <div className="flex items-center space-x-2">
                {dbUser.pfp_url && (
                  <img
                    src={dbUser.pfp_url}
                    alt={dbUser.username}
                    className="w-8 h-8 rounded-full border-2 border-black"
                  />
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-black uppercase">
                    {dbUser.display_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    @{dbUser.username}
                  </div>
                </div>
                {isConnected ? (
                  <div className="text-xs text-green-600 font-black">
                    ✓ WALLET
                  </div>
                ) : (
                  <div className="text-xs text-orange-600 font-black">
                    ○ WALLET
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm font-black uppercase text-gray-500">
                INITIALIZING...
              </div>
            )}
          </div>
        </div>

        {/* Welcome Message */}
        {dbUser && (
          <div className="px-4 pb-2">
            <p className="text-sm font-bold">
              👋 Welcome back,{" "}
              {dbUser.display_name || dbUser.username || `User #${dbUser.fid}`}!
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 pt-0">
          <div className="relative">
            <Input
              placeholder="SEARCH NFTS..."
              className="pr-12 font-bold uppercase placeholder:font-bold"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="p-4 border-b-4 border-black bg-secondary">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black uppercase">TRADE NFTS</h2>
          <p className="text-lg font-black uppercase">
            WITHOUT LEAVING FARCASTER
          </p>
          <Button
            className="font-black uppercase"
            disabled={isLoading || isWalletConnecting}
          >
            {isLoading || isWalletConnecting
              ? "CONNECTING..."
              : dbUser && isConnected
                ? "START TRADING"
                : "ALMOST READY..."}
          </Button>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="p-4 border-b-4 border-black">
        <div className="flex space-x-2 overflow-x-auto">
          <Badge
            variant="default"
            className="font-black uppercase whitespace-nowrap"
          >
            TRENDING
          </Badge>
          <Badge
            variant="neutral"
            className="font-black uppercase whitespace-nowrap"
          >
            ART
          </Badge>
          <Badge
            variant="neutral"
            className="font-black uppercase whitespace-nowrap"
          >
            PFPS
          </Badge>
          <Badge
            variant="neutral"
            className="font-black uppercase whitespace-nowrap"
          >
            GAMING
          </Badge>
        </div>
      </section>

      {/* Live NFT Grid */}
      <section className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black uppercase">LIVE MARKETPLACE</h3>
          <div className="text-sm font-black uppercase text-gray-600">
            {listingsLoading ? (
              <div className="w-16 h-4 bg-muted animate-pulse"></div>
            ) : (
              `${listings.length} NFTS`
            )}
          </div>
        </div>
        <NFTGrid />
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t-4 border-black bg-white">
        <div className="grid grid-cols-4 gap-1">
          <Button
            variant="noShadow"
            className="h-16 flex-col font-black text-xs uppercase"
            asChild
          >
            <Link href="/">
              <HomeIcon className="w-5 h-5 mb-1" />
              HOME
            </Link>
          </Button>
          <Button
            variant="noShadow"
            className="h-16 flex-col font-black text-xs uppercase"
            asChild
          >
            <Link href="/">
              <Grid3X3 className="w-5 h-5 mb-1" />
              BROWSE
            </Link>
          </Button>
          <Button
            variant="noShadow"
            className="h-16 flex-col font-black text-xs uppercase"
            asChild
          >
            <Link href="/list">
              <Plus className="w-5 h-5 mb-1" />
              LIST
            </Link>
          </Button>
          <Button
            variant="noShadow"
            className="h-16 flex-col font-black text-xs uppercase"
            asChild
          >
            <Link href="/profile">
              <User className="w-5 h-5 mb-1" />
              PROFILE
            </Link>
          </Button>
        </div>
      </nav>

      {/* Bottom padding */}
      <div className="h-16"></div>
    </div>
  );
}

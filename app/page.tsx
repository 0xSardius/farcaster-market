"use client";

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useUser } from "@/context/UserContext-clean";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Home as HomeIcon, Grid3X3, Plus, User } from "lucide-react";
import NFTGrid from "@/components/nft/NFTGrid";
import { useMarketplace } from "@/hooks/useMarketplace";
import Link from "next/link";
import { Avatar, Identity, Name, Address } from "@coinbase/onchainkit/identity";
import FallbackAvatar from "@/components/ui/fallback-avatar";
import { HeaderSignIn } from "@/components/HeaderSignIn";
import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { dbUser, isLoading, walletAddress } = useUser();
  const { listings, listingsLoading } = useMarketplace();

  // Initialize MiniKit frame when interface is ready
  useEffect(() => {
    if (!isFrameReady) {
      console.log("🚀 Setting frame ready...");
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

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
            {isLoading || !isFrameReady ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-muted animate-pulse border-2 border-black rounded-full"></div>
                <div className="text-xs font-black uppercase text-gray-500">
                  {!isFrameReady ? "INITIALIZING..." : "LOADING..."}
                </div>
              </div>
            ) : dbUser ? (
              <div className="flex items-center space-x-2">
                {walletAddress ? (
                  <Identity
                    address={walletAddress as `0x${string}`}
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="w-8 h-8 border-2 border-black" />
                    <div className="hidden sm:block">
                      <div className="text-sm font-black uppercase">
                        <Name className="text-sm font-black uppercase" />
                      </div>
                      <div className="text-xs text-gray-600">
                        <Address className="text-xs text-gray-600" />
                      </div>
                    </div>
                  </Identity>
                ) : (
                  dbUser.pfp_url && (
                    <>
                      <FallbackAvatar
                        src={dbUser.pfp_url}
                        alt={dbUser.username || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-black"
                        fallbackText={dbUser.display_name?.charAt(0) || "U"}
                      />
                      <div className="hidden sm:block">
                        <div className="text-sm font-black uppercase">
                          {dbUser.display_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          @{dbUser.username}
                        </div>
                      </div>
                    </>
                  )
                )}
                {walletAddress ? (
                  <div className="text-xs text-green-600 font-black">
                    ✓ WALLET
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-orange-600 font-black">
                      ○ WALLET
                    </div>
                    <div className="scale-75">
                      <WalletConnect />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-muted border-2 border-black rounded-full"></div>
                <div className="text-xs font-black uppercase text-gray-500">
                  GUEST MODE
                </div>
                <HeaderSignIn />
              </div>
            )}
          </div>
        </div>

        {/* Welcome Message */}
        <div className="px-4 pb-2">
          <p className="text-sm font-bold">
            {dbUser ? (
              <>
                👋 Welcome back,{" "}
                {dbUser.display_name ||
                  dbUser.username ||
                  `User #${dbUser.fid}`}
                !
              </>
            ) : (
              <>🌟 Welcome to Farcaster Market!</>
            )}
          </p>
        </div>

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
            disabled={isLoading || !isFrameReady}
          >
            {isLoading || !isFrameReady
              ? "INITIALIZING..."
              : dbUser && walletAddress
                ? "START TRADING"
                : "ALMOST READY..."}
          </Button>
        </div>
      </section>

      {/* Authentication now handled in header */}

      {/* MiniKit automatically handles wallet connection */}

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

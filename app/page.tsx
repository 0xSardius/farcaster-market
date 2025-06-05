"use client";

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Share2 } from "lucide-react";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  // Mock NFT data for demo
  const mockNFTs = [
    {../components/nft/DemoComponents
      id: "1",../components/nft/DemoComponents
      name: "Cool Farc../components/nft/DemoComponents
      image: "https://pics../components/nft/DemoComponents,
      price: "0.05",
      collection: "FC AVATARS",
    },
    {
      id: "2",
      name: "Base Builder Badge",
      image: "https://picsum.photos/300/300?random=2",
      price: "0.1",
      collection: "BASE BADGES",
    },
    {
      id: "3",
      name: "Purple Punk #420",
      image: "https://picsum.photos/300/300?random=3",
      price: "0.25",
      collection: "PURPLE PUNKS",
    },
    {
      id: "4",
      name: "Onchain Summer Vibes",
      image: "https://picsum.photos/300/300?random=4",
      price: "0.08",
      collection: "SUMMER DROPS",
    },
  ];

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

          <Button size="sm" className="font-black uppercase">
            CONNECT
          </Button>
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
          <Button className="font-black uppercase">START TRADING</Button>
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
            variant="secondary"
            className="font-black uppercase whitespace-nowrap"
          >
            ART
          </Badge>
          <Badge
            variant="secondary"
            className="font-black uppercase whitespace-nowrap"
          >
            PFPS
          </Badge>
          <Badge
            variant="secondary"
            className="font-black uppercase whitespace-nowrap"
          >
            GAMING
          </Badge>
        </div>
      </section>

      {/* NFT Grid */}
      <section className="p-4">
        <h3 className="text-xl font-black uppercase mb-4">FEATURED NFTS</h3>
        <div className="grid grid-cols-2 gap-4">
          {mockNFTs.map((nft) => (
            <Card key={nft.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-3">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs font-black">
                    {nft.collection}
                  </Badge>

                  <h4 className="font-bold text-sm line-clamp-2">{nft.name}</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase">PRICE</p>
                      <p className="font-black text-primary">{nft.price} ETH</p>
                    </div>

                    <Button size="sm" className="font-black text-xs">
                      BUY
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t-4 border-black bg-white">
        <div className="grid grid-cols-4 gap-1">
          <Button
            variant="ghost"
            className="h-16 flex-col font-black text-xs uppercase"
          >
            <div className="w-5 h-5 bg-primary mb-1"></div>
            HOME
          </Button>
          <Button
            variant="ghost"
            className="h-16 flex-col font-black text-xs uppercase"
          >
            <div className="w-5 h-5 bg-black mb-1"></div>
            BROWSE
          </Button>
          <Button
            variant="ghost"
            className="h-16 flex-col font-black text-xs uppercase"
          >
            <div className="w-5 h-5 bg-black mb-1"></div>
            LIST
          </Button>
          <Button
            variant="ghost"
            className="h-16 flex-col font-black text-xs uppercase"
          >
            <div className="w-5 h-5 bg-black mb-1"></div>
            PROFILE
          </Button>
        </div>
      </nav>

      {/* Bottom padding to account for fixed nav */}
      <div className="h-16"></div>
    </div>
  );
}

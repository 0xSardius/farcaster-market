"use client";

import { useMarketplace } from "@/hooks/useMarketplace";
import NFTCard from "./NFTCard";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

export default function NFTGrid() {
  const { listings, listingsLoading, listingsError } = useMarketplace();

  if (listingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="font-black uppercase">LOADING NFTS...</p>
        </div>
      </div>
    );
  }

  if (listingsError) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="font-black uppercase text-destructive">
          FAILED TO LOAD NFTS
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          RETRY
        </Button>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="font-black uppercase">NO NFTS FOUND</p>
        <p className="text-sm">BE THE FIRST TO LIST AN NFT!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {listings.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}

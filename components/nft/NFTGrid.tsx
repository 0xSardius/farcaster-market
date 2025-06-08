"use client";

import { useMarketplace } from "@/hooks/useMarketplace";
import NFTCard from "./NFTCard";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { sampleNFTs } from "@/lib/sampleNFTs";

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
        <Button variant="neutral" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          RETRY
        </Button>
      </div>
    );
  }

  // Use sample data if no real listings exist (for demo purposes)
  const displayNFTs = listings.length > 0 ? listings : sampleNFTs;

  return (
    <div className="space-y-4">
      {listings.length === 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded">
          <p className="text-sm font-bold text-blue-800">
            🚧 DEMO MODE: Showing sample NFTs
          </p>
          <p className="text-xs text-blue-600">
            Real marketplace listings will appear here
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {displayNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={{ ...nft, name: String(nft.name) }} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useUser } from "@/context/UserContext";
import { useUserNFTs } from "@/hooks/useUserNFTs";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ListPage() {
  const { isConnected } = useAccount();
  const { dbUser } = useUser();
  const { ownedNFTs, isLoading: nftsLoading } = useUserNFTs();
  const { createListing } = useMarketplace();
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [isListing, setIsListing] = useState(false);

  const handleCreateListing = async () => {
    if (!selectedNFT || !price) return;

    const nft = ownedNFTs.find((n) => n.id === selectedNFT);
    if (!nft) return;

    setIsListing(true);
    try {
      await createListing({
        assetContractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        pricePerToken: price,
      });

      alert("NFT listed successfully!");
      setSelectedNFT(null);
      setPrice("");
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsListing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b-4 border-black bg-white p-4">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="noShadow" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-black uppercase">LIST NFT</h1>
          </div>
        </header>

        <div className="p-4 text-center py-12">
          <p className="font-black uppercase mb-4">WALLET NOT CONNECTED</p>
          <p className="text-sm mb-4">
            Connect your wallet to list NFTs for sale
          </p>
          <Button>CONNECT WALLET</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-white p-4">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="noShadow" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase">LIST NFT</h1>
            <p className="text-sm text-gray-600">
              Sell your NFTs on the marketplace
            </p>
          </div>
        </div>
      </header>

      {/* User Info */}
      {dbUser && (
        <div className="p-4 border-b-2 border-gray-200">
          <div className="flex items-center space-x-3">
            {dbUser.pfp_url && (
              <img
                src={dbUser.pfp_url}
                alt={dbUser.username}
                className="w-10 h-10 rounded-full border-2 border-black"
              />
            )}
            <div>
              <p className="font-black text-sm">
                {dbUser.display_name || dbUser.username}
              </p>
              <p className="text-xs text-gray-600">Your NFTs</p>
            </div>
          </div>
        </div>
      )}

      {/* Your NFTs */}
      <div className="p-4">
        <h2 className="font-black uppercase mb-4">YOUR NFTS</h2>

        {nftsLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="font-black uppercase">LOADING YOUR NFTS...</p>
          </div>
        ) : ownedNFTs.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-black uppercase mb-2">NO NFTS FOUND</p>
            <p className="text-sm text-gray-600">
              You don't have any NFTs to list yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ownedNFTs.map((nft) => (
              <Card
                key={nft.id}
                className={`cursor-pointer transition-all ${
                  selectedNFT === nft.id
                    ? "border-primary border-4"
                    : "border-2 border-black"
                }`}
                onClick={() => setSelectedNFT(nft.id)}
              >
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-200 border-2 border-black flex-shrink-0">
                      {nft.image && (
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge
                        variant="secondary"
                        className="text-xs font-black uppercase mb-2"
                      >
                        {nft.collection}
                      </Badge>
                      <h3 className="font-bold text-sm mb-1 truncate">
                        {nft.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {nft.description}
                      </p>
                    </div>
                    {selectedNFT === nft.id && (
                      <div className="text-primary">
                        <Plus className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Listing Form */}
      {selectedNFT && (
        <div className="border-t-4 border-black bg-secondary p-4">
          <h3 className="font-black uppercase mb-4">SET PRICE</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black uppercase mb-2">
                PRICE (ETH)
              </label>
              <Input
                type="number"
                step="0.001"
                min="0"
                placeholder="0.1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="font-bold"
              />
            </div>
            <Button
              className="w-full font-black uppercase"
              onClick={handleCreateListing}
              disabled={!price || isListing}
            >
              {isListing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  CREATING LISTING...
                </>
              ) : (
                "CREATE LISTING"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Bottom padding for navigation */}
      <div className="h-16"></div>
    </div>
  );
}

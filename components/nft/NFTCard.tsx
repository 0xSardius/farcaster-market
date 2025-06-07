"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { sdk } from "@farcaster/frame-sdk";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useUser } from "@/context/UserContext";
import { useAccount } from "wagmi";
import { useMarketplace } from "@/hooks/useMarketplace";

interface NFTCardProps {
  nft: {
    id: string;
    name: string;
    image: string;
    price: string;
    priceSymbol: string;
    collection: string;
    contractAddress: string;
    tokenId: string;
    listingId: string;
  };
}

export default function NFTCard({ nft }: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const composeCast = async (params: any) => {
    try {
      // Use the Farcaster Frame SDK to compose a cast
      await sdk.actions.composeCast({
        text: params.text,
        embeds: params.embeds,
      });
    } catch (error) {
      console.error("Failed to compose cast:", error);
    }
  };
  const { dbUser } = useUser();
  const { address, isConnected } = useAccount();
  const { marketplace } = useMarketplace();

  const handleShare = async () => {
    try {
      await composeCast({
        text: `Check out "${nft.name}" on Farcaster Market! 🎨\n\nPrice: ${nft.price} ${nft.priceSymbol}`,
        embeds: [
          `https://fcmarket.xyz/nft/${nft.contractAddress}/${nft.tokenId}`,
        ],
      });
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const handleBuySuccess = async () => {
    // Auto-compose purchase announcement
    try {
      await composeCast({
        text: `Just bought "${nft.name}" on Farcaster Market! 🎉\n\n${nft.collection} • ${nft.price} ${nft.priceSymbol}`,
        embeds: [
          `https://fcmarket.xyz/nft/${nft.contractAddress}/${nft.tokenId}`,
        ],
      });

      setShowPurchaseModal(false);
    } catch (error) {
      console.error("Failed to share purchase:", error);
    }
  };

  const handleBuyClick = () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet to purchase NFTs");
      return;
    }
    setShowPurchaseModal(true);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          {nft.image ? (
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/300/300?random=${nft.tokenId}`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-muted-foreground" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button
              size="sm"
              variant={isLiked ? "default" : "secondary"}
              className="w-8 h-8 p-0"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className="w-4 h-4"
                fill={isLiked ? "currentColor" : "none"}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-3">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs font-black uppercase">
              {nft.collection}
            </Badge>

            <h4 className="font-bold text-sm line-clamp-2">{nft.name}</h4>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase">PRICE</p>
                <p className="font-black text-primary">
                  {nft.price} {nft.priceSymbol}
                </p>
              </div>

              <Button
                size="sm"
                className="font-black text-xs"
                onClick={handleBuyClick}
              >
                BUY
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-black uppercase">
                    CONFIRM PURCHASE
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're about to buy this NFT
                  </p>
                </div>

                <div className="border-2 border-black p-3">
                  <h4 className="font-bold text-sm">{nft.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {nft.collection}
                  </p>
                  <p className="font-black text-primary mt-1">
                    {nft.price} {nft.priceSymbol}
                  </p>
                </div>

                <Transaction
                  contracts={[
                    {
                      address: process.env
                        .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`,
                      abi: [
                        {
                          name: "buyFromListing",
                          type: "function",
                          stateMutability: "payable",
                          inputs: [
                            { name: "_listingId", type: "uint256" },
                            { name: "_buyFor", type: "address" },
                            { name: "_quantity", type: "uint256" },
                            { name: "_currency", type: "address" },
                            { name: "_expectedTotalPrice", type: "uint256" },
                          ],
                          outputs: [],
                        },
                      ],
                      functionName: "buyFromListing",
                      args: [
                        BigInt(nft.listingId),
                        address as `0x${string}`, // buyer address
                        BigInt(1), // quantity
                        "0x0000000000000000000000000000000000000000", // ETH
                        BigInt(parseFloat(nft.price) * 1e18), // price in wei
                      ],
                    },
                  ]}
                  onSuccess={handleBuySuccess}
                  onError={(error) => {
                    console.error("Purchase failed:", error);
                    alert("Purchase failed. Please try again.");
                  }}
                >
                  <div className="space-y-3">
                    <TransactionButton
                      text={`Buy for ${nft.price} ${nft.priceSymbol}`}
                      className="w-full font-black uppercase"
                    />
                    <TransactionStatus />
                  </div>
                </Transaction>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    className="flex-1 font-black uppercase"
                    onClick={() => setShowPurchaseModal(false)}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

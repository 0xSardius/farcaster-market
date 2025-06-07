"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useComposeCast } from "@coinbase/onchainkit/minikit";

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
  const composeCast = useComposeCast();

  const handleShare = async () => {
    try {
      await composeCast({
        text: `Check out "${nft.name}" on Farcaster Market! 🎨`,
        embeds: [
          `https://fcmarket.xyz/nft/${nft.contractAddress}/${nft.tokenId}`,
        ],
      });
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const handleBuy = () => {
    // We'll implement this in the next step
    console.log("Buy NFT:", nft.id);
  };

  return (
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
              onClick={handleBuy}
            >
              BUY
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

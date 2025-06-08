"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { NFTApiService, type NFTMetadata } from "@/lib/nftApi";
import { sampleUserNFTs } from "@/lib/sampleNFTs";

export function useUserNFTs() {
  const { walletAddress } = useUser();
  const [ownedNFTs, setOwnedNFTs] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!walletAddress) {
        setOwnedNFTs([]);
        return;
      }

      // Auto-fetch NFTs as soon as we have a wallet address from MiniKit
      // This ensures data loads immediately when wallet connects through Frame SDK

      setIsLoading(true);
      setError(null);

      try {
        // Fetch real NFTs using the API service
        const response = await NFTApiService.fetchUserNFTs(
          walletAddress,
          "base",
        );

        if (response.nfts.length > 0) {
          setOwnedNFTs(response.nfts);
        } else {
          // Fallback to sample data for demo purposes
          // Convert sample NFTs to match the NFTMetadata interface
          const sampleNFTs: NFTMetadata[] = sampleUserNFTs.map((nft) => ({
            id: nft.id,
            name: nft.name,
            description: nft.description,
            image: nft.image,
            contractAddress: nft.contractAddress,
            tokenId: nft.tokenId.toString(),
            collection: nft.collection,
          }));

          setOwnedNFTs(sampleNFTs);
        }
      } catch (error) {
        console.error("Failed to fetch user NFTs:", error);
        setError("Failed to load your NFTs. Please try again.");

        // Even on error, show sample data for demo
        const sampleNFTs: NFTMetadata[] = sampleUserNFTs.map((nft) => ({
          id: nft.id,
          name: nft.name,
          description: nft.description,
          image: nft.image,
          contractAddress: nft.contractAddress,
          tokenId: nft.tokenId.toString(),
          collection: nft.collection,
        }));

        setOwnedNFTs(sampleNFTs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNFTs();
  }, [walletAddress]); // Only depend on walletAddress from MiniKit

  return {
    ownedNFTs,
    isLoading,
    error,
    hasNFTs: ownedNFTs.length > 0,
    refetch: () => {
      // Trigger a refetch
      if (walletAddress) {
        setIsLoading(true);
        // The useEffect will handle the actual fetching
      }
    },
  };
}

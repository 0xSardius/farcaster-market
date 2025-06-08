"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { NFTApiService, type NFTMetadata } from "@/lib/nftApi";
import { sampleUserNFTs } from "@/lib/sampleNFTs";

export function useUserNFTs() {
  const { address, isConnected } = useAccount();
  const [ownedNFTs, setOwnedNFTs] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!address) {
        setOwnedNFTs([]);
        return;
      }

      // Auto-fetch NFTs as soon as we have an address, regardless of isConnected status
      // This ensures data loads immediately when wallet auto-connects

      setIsLoading(true);
      setError(null);

      try {
        // Fetch real NFTs using the API service
        const response = await NFTApiService.fetchUserNFTs(address, "base");

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
  }, [address]); // Only depend on address, not isConnected

  return {
    ownedNFTs,
    isLoading,
    error,
    hasNFTs: ownedNFTs.length > 0,
    refetch: () => {
      // Trigger a refetch
      if (address) {
        setIsLoading(true);
        // The useEffect will handle the actual fetching
      }
    },
  };
}

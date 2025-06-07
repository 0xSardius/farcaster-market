"use client";

import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { useAccount } from "wagmi";

export function useUserNFTs() {
  const { address } = useAccount();

  // You can add specific NFT contracts here, or use a generic approach
  // For now, we'll focus on a few popular Base NFT contracts
  const POPULAR_CONTRACTS = [
    // Add popular Base NFT contract addresses here
    // Example: "0x..."
  ];

  // For the contest, we can use this to fetch from any contract
  // In production, you'd want to be more specific
  const {
    data: ownedNFTs,
    isLoading,
    error,
  } = useOwnedNFTs(
    // Pass the contract if you have a specific one, or null for all
    null, // This will fetch from all contracts (might be slow)
    address,
  );

  const formattedNFTs =
    ownedNFTs?.map((nft) => ({
      id: nft.metadata.id,
      name: nft.metadata.name || `Token #${nft.metadata.id}`,
      description: nft.metadata.description || "",
      image: nft.metadata.image || nft.metadata.animation_url || "",
      contractAddress: nft.owner,
      tokenId: nft.metadata.id,
      collection: nft.metadata.properties?.collection || "Unknown Collection",
    })) || [];

  return {
    ownedNFTs: formattedNFTs,
    isLoading,
    error,
    hasNFTs: formattedNFTs.length > 0,
  };
}

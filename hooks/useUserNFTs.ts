"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { sampleUserNFTs } from "@/lib/sampleNFTs";

export function useUserNFTs() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [address]);

  // For demo purposes, return sample NFTs when connected
  const ownedNFTs = isConnected ? sampleUserNFTs : [];

  return {
    ownedNFTs,
    isLoading,
    error: null,
    hasNFTs: ownedNFTs.length > 0,
  };
}

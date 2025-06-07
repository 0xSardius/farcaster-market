"use client";

import { useContract, useValidDirectListings } from "@thirdweb-dev/react";

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "";

export function useMarketplace() {
  // Connect to marketplace contract
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3",
  );

  // Fetch all active listings
  const {
    data: listings,
    isLoading: listingsLoading,
    error: listingsError,
  } = useValidDirectListings(marketplace, {
    count: 100, // Fetch first 100 listings
    start: 0,
  });

  // Format listings for our UI
  const formattedListings =
    listings?.map((listing) => ({
      id: listing.id,
      name: listing.asset.name || `Token #${listing.asset.id}`,
      description: listing.asset.description || "",
      image: listing.asset.image || listing.asset.animation_url || "",
      price: listing.currencyValuePerToken.displayValue,
      priceSymbol: listing.currencyValuePerToken.symbol,
      collection: listing.asset.collection?.name || "Unknown Collection",
      contractAddress: listing.assetContractAddress,
      tokenId: listing.asset.id,
      listingId: listing.id,
      seller: listing.creatorAddress,
      endTime: listing.endTimeInSeconds,
    })) || [];

  // Buy a listing
  const buyListing = async (listingId: string) => {
    if (!marketplace) throw new Error("Marketplace not loaded");

    const transaction = await marketplace.directListings.buyFromListing(
      listingId,
      1, // quantity
    );

    return transaction;
  };

  // Create a listing
  const createListing = async (params: {
    assetContractAddress: string;
    tokenId: string;
    pricePerToken: string;
    currencyContractAddress?: string;
  }) => {
    if (!marketplace) throw new Error("Marketplace not loaded");

    const transaction = await marketplace.directListings.createListing({
      assetContractAddress: params.assetContractAddress,
      tokenId: params.tokenId,
      pricePerToken: params.pricePerToken,
      currencyContractAddress:
        params.currencyContractAddress ||
        "0x0000000000000000000000000000000000000000", // ETH
      startTimestamp: Math.floor(Date.now() / 1000),
      endTimestamp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
      quantity: 1,
      reserved: false,
    });

    return transaction;
  };

  return {
    marketplace,
    listings: formattedListings,
    listingsLoading,
    listingsError,
    buyListing,
    createListing,
  };
}

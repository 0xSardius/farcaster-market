// Sample NFT data for testing the marketplace
// This will be replaced with real Thirdweb data once we have actual listings

export const sampleNFTs = [
  {
    id: "sample-1",
    name: "CryptoPunk #1234",
    description: "A rare CryptoPunk with distinctive traits",
    image:
      "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Punk+%231234",
    price: "0.5",
    priceSymbol: "ETH",
    collection: "CryptoPunks",
    contractAddress: "0x123...",
    tokenId: "1234",
    listingId: "listing-1",
    seller: "0xabc...",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
  },
  {
    id: "sample-2",
    name: "Bored Ape #5678",
    description: "A bored ape with golden fur and laser eyes",
    image: "https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Ape+%235678",
    price: "2.1",
    priceSymbol: "ETH",
    collection: "Bored Ape Yacht Club",
    contractAddress: "0x456...",
    tokenId: "5678",
    listingId: "listing-2",
    seller: "0xdef...",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 3, // 3 days from now
  },
  {
    id: "sample-3",
    name: "Azuki #9012",
    description: "Clean anime-style character with rare traits",
    image:
      "https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Azuki+%239012",
    price: "1.2",
    priceSymbol: "ETH",
    collection: "Azuki",
    contractAddress: "0x789...",
    tokenId: "9012",
    listingId: "listing-3",
    seller: "0xghi...",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days from now
  },
  {
    id: "sample-4",
    name: "Art Blocks #3456",
    description: "Generative art piece with geometric patterns",
    image: "https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Art+%233456",
    price: "0.8",
    priceSymbol: "ETH",
    collection: "Art Blocks",
    contractAddress: "0x101...",
    tokenId: "3456",
    listingId: "listing-4",
    seller: "0xjkl...",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 5, // 5 days from now
  },
  {
    id: "sample-5",
    name: "CloneX #7890",
    description: "3D avatar with cyberpunk aesthetics",
    image:
      "https://via.placeholder.com/400x400/FECA57/FFFFFF?text=CloneX+%237890",
    price: "3.5",
    priceSymbol: "ETH",
    collection: "CloneX",
    contractAddress: "0x202...",
    tokenId: "7890",
    listingId: "listing-5",
    seller: "0xmno...",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 10, // 10 days from now
  },
  {
    id: "sample-6",
    name: "Doodles #2468",
    description: "Colorful hand-drawn character",
    image:
      "https://via.placeholder.com/400x400/FF9FF3/FFFFFF?text=Doodle+%232468",
    price: "0.3",
    priceSymbol: "ETH",
    collection: "Doodles",
    contractAddress: "0x303...",
    tokenId: "2468",
    listingId: "listing-6",
    seller: "0xpqr...",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 1, // 1 day from now
  },
];

// Sample user NFTs for the listing page
export const sampleUserNFTs = [
  {
    id: "user-nft-1",
    name: "My Special NFT",
    description: "A unique NFT that I want to sell",
    image: "https://via.placeholder.com/400x400/F38BA8/FFFFFF?text=My+NFT+%231",
    contractAddress: "0x404...",
    tokenId: "1111",
    collection: "Personal Collection",
  },
  {
    id: "user-nft-2",
    name: "Cool Digital Art",
    description: "Abstract digital artwork I created",
    image: "https://via.placeholder.com/400x400/A8DADC/FFFFFF?text=Art+%232",
    contractAddress: "0x505...",
    tokenId: "2222",
    collection: "Digital Art",
  },
];

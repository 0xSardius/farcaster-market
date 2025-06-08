// NFT API service for fetching user's owned NFTs
// This can integrate with various providers like Alchemy, Moralis, OpenSea, etc.

export interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  tokenId: string;
  collection: string;
}

export interface NFTApiResponse {
  nfts: NFTMetadata[];
  hasMore: boolean;
  nextCursor?: string;
}

// For now, we'll implement a simple version that can be extended with real APIs
export class NFTApiService {
  /**
   * Fetch NFTs owned by a wallet address
   * In production, this would call real APIs like:
   * - Alchemy NFT API
   * - Moralis NFT API
   * - OpenSea API
   * - Base chain explorers
   */
  static async fetchUserNFTs(
    walletAddress: string,
    chain: string = "base",
  ): Promise<NFTApiResponse> {
    // For development/demo purposes, return empty for now
    // In production, implement actual API calls:

    try {
      // Example structure for real implementation:

      // Method 1: Alchemy NFT API
      // const alchemyNFTs = await this.fetchFromAlchemy(walletAddress, chain);

      // Method 2: Moralis NFT API
      // const moralisNFTs = await this.fetchFromMoralis(walletAddress, chain);

      // Method 3: OpenSea API
      // const openSeaNFTs = await this.fetchFromOpenSea(walletAddress, chain);

      // Method 4: Chain-specific indexers
      // const chainNFTs = await this.fetchFromChainIndexer(walletAddress, chain);

      console.log(`Fetching NFTs for ${walletAddress} on ${chain}...`);

      // For now, return empty array
      // Real implementation would combine and deduplicate results from multiple sources
      return {
        nfts: [],
        hasMore: false,
      };
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
      return {
        nfts: [],
        hasMore: false,
      };
    }
  }

  /**
   * Example implementation for Alchemy NFT API
   * Uncomment and configure when ready to use
   */
  /*
  private static async fetchFromAlchemy(
    walletAddress: string, 
    chain: string
  ): Promise<NFTMetadata[]> {
    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    if (!alchemyApiKey) return [];

    const baseUrl = chain === 'base' 
      ? `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`
      : `https://eth-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`;

    const response = await fetch(
      `${baseUrl}/getNFTsForOwner?owner=${walletAddress}&withMetadata=true`
    );

    if (!response.ok) throw new Error('Alchemy API failed');

    const data = await response.json();
    
    return data.ownedNfts?.map((nft: any) => ({
      id: `${nft.contract.address}-${nft.id.tokenId}`,
      name: nft.title || `Token #${nft.id.tokenId}`,
      description: nft.description || '',
      image: nft.media?.[0]?.gateway || nft.metadata?.image || '',
      contractAddress: nft.contract.address,
      tokenId: nft.id.tokenId,
      collection: nft.contract.name || 'Unknown Collection',
    })) || [];
  }
  */

  /**
   * Example implementation for Moralis NFT API
   * Uncomment and configure when ready to use
   */
  /*
  private static async fetchFromMoralis(
    walletAddress: string,
    chain: string
  ): Promise<NFTMetadata[]> {
    const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    if (!moralisApiKey) return [];

    const chainParam = chain === 'base' ? 'base' : 'eth';
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2/${walletAddress}/nft?chain=${chainParam}&format=decimal`,
      {
        headers: {
          'X-API-Key': moralisApiKey,
        },
      }
    );

    if (!response.ok) throw new Error('Moralis API failed');

    const data = await response.json();
    
    return data.result?.map((nft: any) => ({
      id: `${nft.token_address}-${nft.token_id}`,
      name: nft.name || `Token #${nft.token_id}`,
      description: nft.metadata?.description || '',
      image: nft.metadata?.image || '',
      contractAddress: nft.token_address,
      tokenId: nft.token_id,
      collection: nft.name || 'Unknown Collection',
    })) || [];
  }
  */

  /**
   * Validate NFT metadata and sanitize inputs
   */
  static validateNFTMetadata(nft: unknown): NFTMetadata | null {
    try {
      if (!nft.contractAddress || !nft.tokenId) return null;

      return {
        id: nft.id || `${nft.contractAddress}-${nft.tokenId}`,
        name: nft.name || `Token #${nft.tokenId}`,
        description: nft.description || "",
        image: nft.image || "",
        contractAddress: nft.contractAddress.toLowerCase(),
        tokenId: nft.tokenId.toString(),
        collection: nft.collection || "Unknown Collection",
      };
    } catch (error) {
      console.warn("Invalid NFT metadata:", error);
      return null;
    }
  }
}

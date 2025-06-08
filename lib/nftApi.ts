// NFT API service for fetching user's owned NFTs
// This can integrate with various providers like Alchemy, Moralis, OpenSea, etc.

interface AlchemyNFT {
  contract: {
    address: string;
    name?: string;
    openSea?: { collectionName?: string };
  };
  id: { tokenId: string };
  title?: string;
  description?: string;
  metadata?: { name?: string; description?: string; image?: string };
  media?: Array<{ gateway?: string }>;
  image?: { originalUrl?: string };
}

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
    try {
      console.log(`🔍 Fetching real NFTs for ${walletAddress} on ${chain}...`);

      // Fetch from Alchemy API
      const alchemyNFTs = await this.fetchFromAlchemy(walletAddress);

      console.log(`✅ Found ${alchemyNFTs.length} NFTs from Alchemy API`);

      return {
        nfts: alchemyNFTs,
        hasMore: false, // For now, we'll get all NFTs in one call
      };
    } catch (error) {
      console.error("❌ Failed to fetch NFTs from Alchemy:", error);
      return {
        nfts: [],
        hasMore: false,
      };
    }
  }

  /**
   * Alchemy NFT API implementation for fetching user's owned NFTs
   */
  private static async fetchFromAlchemy(
    walletAddress: string,
  ): Promise<NFTMetadata[]> {
    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;

    if (!alchemyApiKey || !alchemyUrl) {
      console.warn("⚠️ Alchemy configuration not found", {
        hasApiKey: !!alchemyApiKey,
        hasUrl: !!alchemyUrl,
      });
      return [];
    }

    try {
      // Use the Alchemy URL from environment variables
      const baseUrl = alchemyUrl.replace("/v2/", "/nft/v3/");
      const url = `${baseUrl}/getNFTsForOwner?owner=${walletAddress}&withMetadata=true&pageSize=100`;

      console.log(
        `🌐 Calling Alchemy API: ${url.replace(alchemyApiKey, "xxx")}`,
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Alchemy API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      console.log(`📊 Raw Alchemy response:`, {
        totalCount: data.totalCount,
        ownedNftsCount: data.ownedNfts?.length || 0,
      });

      if (!data.ownedNfts || data.ownedNfts.length === 0) {
        console.log("📦 No NFTs found for this wallet");
        return [];
      }

      const nfts = data.ownedNfts.map((nft: AlchemyNFT) => ({
        id: `${nft.contract.address}-${nft.id.tokenId}`,
        name: nft.title || nft.metadata?.name || `Token #${nft.id.tokenId}`,
        description: nft.description || nft.metadata?.description || "",
        image:
          nft.media?.[0]?.gateway ||
          nft.metadata?.image ||
          nft.image?.originalUrl ||
          "",
        contractAddress: nft.contract.address,
        tokenId: nft.id.tokenId,
        collection:
          nft.contract.name ||
          nft.contract.openSea?.collectionName ||
          "Unknown Collection",
      }));

      console.log(`✨ Processed ${nfts.length} NFTs from Alchemy`);
      return nfts;
    } catch (error) {
      console.error("💥 Alchemy API error:", error);
      return [];
    }
  }

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
      const nftData = nft as Partial<NFTMetadata>;
      if (!nftData?.contractAddress || !nftData?.tokenId) return null;

      return {
        id: nftData.id || `${nftData.contractAddress}-${nftData.tokenId}`,
        name: nftData.name || `Token #${nftData.tokenId}`,
        description: nftData.description || "",
        image: nftData.image || "",
        contractAddress: nftData.contractAddress.toLowerCase(),
        tokenId: nftData.tokenId.toString(),
        collection: nftData.collection || "Unknown Collection",
      };
    } catch (error) {
      console.warn("Invalid NFT metadata:", error);
      return null;
    }
  }
}

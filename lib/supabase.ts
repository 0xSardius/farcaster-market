import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Updated Types to match your schema
export interface User {
  id: string;
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  wallet_address?: string;
  created_at: string;
  updated_at: string;
  last_seen: string;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: "purchase" | "listing" | "share" | "like" | "view";
  nft_contract: string;
  nft_token_id: string;
  nft_name?: string;
  collection_name?: string;
  marketplace_listing_id?: string;
  price_eth?: number;
  price_usd?: number;
  tx_hash?: string;
  block_number?: number;
  from_address?: string;
  to_address?: string;
  cast_hash?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  nft_contract: string;
  nft_token_id: string;
  created_at: string;
}

export interface NFTCollection {
  id: string;
  contract_address: string;
  name: string;
  description?: string;
  image_url?: string;
  floor_price_eth?: number;
  total_volume_eth?: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// USER MANAGEMENT FUNCTIONS
// ============================================

export const createOrUpdateUser = async (userData: {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  bio?: string;
  wallet_address?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          fid: userData.fid,
          username: userData.username,
          display_name: userData.display_name,
          pfp_url: userData.pfp_url,
          bio: userData.bio,
          wallet_address: userData.wallet_address,
          last_seen: new Date().toISOString(),
        },
        {
          onConflict: "fid",
        },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
};

export const getUserByFid = async (fid: number): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("fid", fid)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
    return data;
  } catch (error) {
    console.error("Error getting user by FID:", error);
    throw error;
  }
};

export const updateUserWallet = async (fid: number, walletAddress: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        wallet_address: walletAddress,
        last_seen: new Date().toISOString(),
      })
      .eq("fid", fid)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating user wallet:", error);
    throw error;
  }
};

// ============================================
// ACTIVITY FUNCTIONS
// ============================================

export const logActivity = async (
  userId: string,
  activityType: Activity["activity_type"],
  nftData: {
    contract: string;
    tokenId: string;
    name?: string;
    collection?: string;
    listingId?: string;
    priceEth?: number;
    priceUsd?: number;
    txHash?: string;
    blockNumber?: number;
    fromAddress?: string;
    toAddress?: string;
    castHash?: string;
    metadata?: Record<string, unknown>;
  },
) => {
  try {
    const { data, error } = await supabase
      .from("activity")
      .insert({
        user_id: userId,
        activity_type: activityType,
        nft_contract: nftData.contract,
        nft_token_id: nftData.tokenId,
        nft_name: nftData.name,
        collection_name: nftData.collection,
        marketplace_listing_id: nftData.listingId,
        price_eth: nftData.priceEth,
        price_usd: nftData.priceUsd,
        tx_hash: nftData.txHash,
        block_number: nftData.blockNumber,
        from_address: nftData.fromAddress,
        to_address: nftData.toAddress,
        cast_hash: nftData.castHash,
        metadata: nftData.metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

export const getUserActivity = async (
  userId: string,
  activityType?: Activity["activity_type"],
  limit: number = 50,
) => {
  try {
    let query = supabase
      .from("activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (activityType) {
      query = query.eq("activity_type", activityType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user activity:", error);
    throw error;
  }
};

export const getRecentActivity = async (limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from("activity")
      .select(
        `
        *,
        users!inner(username, display_name, pfp_url)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting recent activity:", error);
    throw error;
  }
};

// ============================================
// FAVORITES FUNCTIONS
// ============================================

export const toggleFavorite = async (
  userId: string,
  nftContract: string,
  nftTokenId: string,
) => {
  try {
    // Check if already favorited
    const { data: existing } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("nft_contract", nftContract)
      .eq("nft_token_id", nftTokenId)
      .single();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("id", existing.id);

      if (error) throw error;
      return { favorited: false };
    } else {
      // Add favorite
      const { data, error } = await supabase
        .from("user_favorites")
        .insert({
          user_id: userId,
          nft_contract: nftContract,
          nft_token_id: nftTokenId,
        })
        .select()
        .single();

      if (error) throw error;
      return { favorited: true, data };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user favorites:", error);
    throw error;
  }
};

export const checkIsFavorited = async (
  userId: string,
  nftContract: string,
  nftTokenId: string,
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("nft_contract", nftContract)
      .eq("nft_token_id", nftTokenId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if favorited:", error);
    return false;
  }
};

// ============================================
// COLLECTION FUNCTIONS
// ============================================

export const createOrUpdateCollection = async (collectionData: {
  contract_address: string;
  name: string;
  description?: string;
  image_url?: string;
  floor_price_eth?: number;
  total_volume_eth?: number;
  total_sales?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("nft_collections")
      .upsert(collectionData, {
        onConflict: "contract_address",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating/updating collection:", error);
    throw error;
  }
};

export const getCollectionStats = async (contractAddress: string) => {
  try {
    const { data: collection, error: collectionError } = await supabase
      .from("nft_collections")
      .select("*")
      .eq("contract_address", contractAddress)
      .single();

    if (collectionError && collectionError.code !== "PGRST116")
      throw collectionError;

    // Get activity stats from our activity table
    const { data: stats, error: statsError } = await supabase
      .from("activity")
      .select("price_eth, activity_type")
      .eq("nft_contract", contractAddress)
      .eq("activity_type", "purchase");

    if (statsError) throw statsError;

    const totalVolume =
      stats?.reduce((sum, activity) => sum + (activity.price_eth || 0), 0) || 0;
    const totalSales = stats?.length || 0;

    return {
      collection,
      computed_stats: {
        total_volume_eth: totalVolume,
        total_sales: totalSales,
      },
    };
  } catch (error) {
    console.error("Error getting collection stats:", error);
    throw error;
  }
};

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

export const getMarketplaceStats = async () => {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Get total NFTs (unique contract + token combinations)
    const { data: uniqueNFTs } = await supabase
      .from("activity")
      .select("nft_contract, nft_token_id")
      .eq("activity_type", "listing");

    const totalNFTs = uniqueNFTs
      ? new Set(
          uniqueNFTs.map((nft) => `${nft.nft_contract}:${nft.nft_token_id}`),
        ).size
      : 0;

    // Get total volume
    const { data: purchases } = await supabase
      .from("activity")
      .select("price_eth")
      .eq("activity_type", "purchase")
      .not("price_eth", "is", null);

    const totalVolume =
      purchases?.reduce(
        (sum, purchase) => sum + (purchase.price_eth || 0),
        0,
      ) || 0;

    return {
      total_users: totalUsers || 0,
      total_nfts: totalNFTs,
      total_volume_eth: totalVolume,
      total_sales: purchases?.length || 0,
    };
  } catch (error) {
    console.error("Error getting marketplace stats:", error);
    throw error;
  }
};

// ============================================
// BATCH OPERATIONS (for performance)
// ============================================

export const logMultipleActivities = async (
  activities: Array<Omit<Activity, "id" | "created_at">>,
) => {
  try {
    const { data, error } = await supabase
      .from("activity")
      .insert(activities)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error logging multiple activities:", error);
    throw error;
  }
};

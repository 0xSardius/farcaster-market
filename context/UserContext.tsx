"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { sdk } from "@farcaster/frame-sdk";
import {
  createOrUpdateUser,
  getUserByFid,
  updateUserWallet,
  type User as DBUser,
} from "@/lib/supabase";
import { useAccount } from "wagmi";

interface UserContextType {
  dbUser: DBUser | null;
  setDbUser: (user: DBUser | null) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAccount();

  // Remove auto-connect wallet logic to prevent flickering
  // Users will connect manually via the WalletConnect component

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      // Get user context from Farcaster Frame SDK
      const context = await sdk.context;

      if (context?.user) {
        // First, check if user exists in database
        const existingUser = await getUserByFid(context.user.fid);

        if (existingUser) {
          // User exists - update with fresh Farcaster data but preserve DB fields
          const userData = await createOrUpdateUser({
            fid: context.user.fid,
            username: context.user.username || existingUser.username,
            display_name: context.user.displayName || existingUser.display_name,
            pfp_url: context.user.pfpUrl || existingUser.pfp_url,
            bio: existingUser.bio, // Preserve existing bio
            wallet_address: address || existingUser.wallet_address, // Preserve existing wallet if no new one
          });
          setDbUser(userData);
        } else {
          // New user - create with Farcaster data
          const userData = await createOrUpdateUser({
            fid: context.user.fid,
            username: context.user.username || undefined,
            display_name: context.user.displayName || undefined,
            pfp_url: context.user.pfpUrl || undefined,
            bio: undefined,
            wallet_address: address || undefined,
          });
          setDbUser(userData);

          // TODO: Could trigger welcome flow for new users here
          console.log("✨ Welcome new user!", userData.display_name);
        }
      }
    } catch (error) {
      console.log("Error loading user data:", error);
      // Fallback: try to load from Farcaster context only
      try {
        const context = await sdk.context;
        if (context?.user) {
          // Create a minimal user object
          const fallbackUser: Partial<DBUser> = {
            id: "", // Will be set when saved to DB
            fid: context.user.fid,
            username: context.user.username || undefined,
            display_name: context.user.displayName || undefined,
            pfp_url: context.user.pfpUrl || undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_seen: new Date().toISOString(),
          };
          setDbUser(fallbackUser as DBUser);
        }
      } catch (fallbackError) {
        console.log("Not in Farcaster context:", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update wallet address when connected
  useEffect(() => {
    if (dbUser && address && dbUser.wallet_address !== address) {
      console.log(
        "💰 Updating wallet address for user:",
        dbUser.username,
        address,
      );
      updateUserWallet(dbUser.fid, address).catch(console.error);
      setDbUser({ ...dbUser, wallet_address: address });
    }
  }, [address, dbUser]);

  // Initial user data load
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        dbUser,
        setDbUser,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

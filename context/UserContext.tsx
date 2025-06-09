"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import {
  createOrUpdateUser,
  getUserByFid,
  type User as DBUser,
} from "@/lib/supabase";

interface UserContextType {
  dbUser: DBUser | null;
  setDbUser: (user: DBUser | null) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  walletAddress: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const { context } = useMiniKit();

  // Load user data from MiniKit context
  useEffect(() => {
    const loadUserData = async () => {
      console.log("🔄 Loading user data...", { 
        context: !!context, 
        contextUser: !!context?.user,
        contextDetails: context 
      });

      // Check if we have MiniKit context
      if (!context?.user) {
        console.log("⚠️ No MiniKit context available, waiting...");
        
        // In development, MiniKit context might not be available
        // Set a timeout to stop loading after a reasonable time
        setTimeout(() => {
          console.log("⏰ Development mode - stopping loading");
          setIsLoading(false);
        }, 2000);
        return;
      }

      try {
        setIsLoading(true);
        const userData = context.user;
        
        console.log("📱 MiniKit user data:", userData);

        // Extract wallet address if available in context
        // Note: Wallet connection will be handled by OnchainKit components

        // Check if user exists in database
        const existingUser = await getUserByFid(userData.fid);

        if (existingUser) {
          // Update existing user with fresh data
          const updatedUser = await createOrUpdateUser({
            fid: userData.fid,
            username: userData.username || existingUser.username,
            display_name: userData.displayName || existingUser.display_name,
            pfp_url: userData.pfpUrl || existingUser.pfp_url,
            bio: existingUser.bio,
            wallet_address: walletAddress ?? existingUser.wallet_address,
          });
          setDbUser(updatedUser);
          console.log("✅ User updated:", updatedUser.display_name);
        } else {
          // Create new user
          const newUser = await createOrUpdateUser({
            fid: userData.fid,
            username: userData.username || undefined,
            display_name: userData.displayName || undefined,
            pfp_url: userData.pfpUrl || undefined,
            bio: undefined,
            wallet_address: walletAddress ?? undefined,
          });
          setDbUser(newUser);
          console.log("✨ Welcome new user!", newUser.display_name);
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [context]);

  const refreshUser = async () => {
    if (!context?.user) return;
    
    const userData = context.user;
    try {
      const updatedUser = await createOrUpdateUser({
        fid: userData.fid,
        username: userData.username,
        display_name: userData.displayName,
        pfp_url: userData.pfpUrl,
        bio: dbUser?.bio,
                 wallet_address: walletAddress ?? undefined,
      });
      setDbUser(updatedUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        dbUser,
        setDbUser,
        isLoading,
        refreshUser,
        walletAddress,
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

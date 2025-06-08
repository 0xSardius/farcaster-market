"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/frame-sdk";
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
  isFrameReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const { setFrameReady, isFrameReady, context } = useMiniKit();

  // Initialize the frame and get wallet connection
  useEffect(() => {
    const initializeFrame = async () => {
      try {
        // Call ready to hide splash screen
        if (!isFrameReady) {
          await setFrameReady();
        }

        // Get the Frame SDK context for user data and wallet
        const frameContext = await sdk.context;

        if (frameContext?.user) {
          console.log("🎯 Frame context loaded:", frameContext.user);
        }

        // Check if wallet is available through Frame SDK
        if (sdk.wallet && sdk.wallet.ethProvider) {
          try {
            // Request wallet accounts (this should be silent in Farcaster)
            const accounts = (await sdk.wallet.ethProvider.request({
              method: "eth_accounts",
            })) as string[];

            if (accounts && accounts.length > 0) {
              const address = accounts[0];
              setWalletAddress(address);
              console.log("🏦 Wallet connected:", address);
            } else {
              // Request connection if no accounts
              const requestedAccounts = (await sdk.wallet.ethProvider.request({
                method: "eth_requestAccounts",
              })) as string[];

              if (requestedAccounts && requestedAccounts.length > 0) {
                const address = requestedAccounts[0];
                setWalletAddress(address);
                console.log("🏦 Wallet connected after request:", address);
              }
            }
          } catch (walletError) {
            console.log(
              "💼 Wallet not available or connection failed:",
              walletError,
            );
          }
        }
      } catch (error) {
        console.log(
          "🚫 Frame initialization failed (expected outside Farcaster):",
          error,
        );
      }
    };

    initializeFrame();
  }, [setFrameReady, isFrameReady]);

  // Load user data from MiniKit context and database
  const refreshUser = async () => {
    try {
      setIsLoading(true);

      // Try to get user from MiniKit context first
      let userData = null;

      if (context?.user) {
        userData = context.user;
        console.log("📱 Using MiniKit context user:", userData);
      } else {
        // Fallback to Frame SDK context
        try {
          const frameContext = await sdk.context;
          if (frameContext?.user) {
            userData = frameContext.user;
            console.log("🖼️ Using Frame SDK context user:", userData);
          }
        } catch (error) {
          console.log("Not in Frame context:", error);
        }
      }

      if (userData) {
        // Check if user exists in database
        const existingUser = await getUserByFid(userData.fid);

        if (existingUser) {
          // Update existing user with fresh data
          const updatedUser = await createOrUpdateUser({
            fid: userData.fid,
            username: userData.username || existingUser.username,
            display_name: userData.displayName || existingUser.display_name,
            pfp_url: userData.pfpUrl || existingUser.pfp_url,
            bio: existingUser.bio, // Preserve existing bio
            wallet_address: walletAddress || existingUser.wallet_address,
          });
          setDbUser(updatedUser);
        } else {
          // Create new user
          const newUser = await createOrUpdateUser({
            fid: userData.fid,
            username: userData.username || undefined,
            display_name: userData.displayName || undefined,
            pfp_url: userData.pfpUrl || undefined,
            bio: undefined,
            wallet_address: walletAddress || undefined,
          });
          setDbUser(newUser);
          console.log("✨ Welcome new user!", newUser.display_name);
        }
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data when context or wallet changes
  useEffect(() => {
    if (context || walletAddress) {
      refreshUser();
    }
  }, [context, walletAddress]);

  // Initial user data load
  useEffect(() => {
    if (!context && !walletAddress) {
      // Try to load user data even without context (for development)
      refreshUser();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        dbUser,
        setDbUser,
        isLoading,
        refreshUser,
        walletAddress,
        isFrameReady,
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

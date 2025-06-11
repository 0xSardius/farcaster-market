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
  fid: number | null;
  isFrameReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use MiniKit as the ONLY source of truth
  const { setFrameReady, isFrameReady, context } = useMiniKit();

  // Initialize frame when ready
  useEffect(() => {
    if (!isFrameReady) {
      console.log("🚀 Setting frame ready...");
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Handle user context from MiniKit
  useEffect(() => {
    const handleUserContext = async () => {
      if (!context?.user?.fid) {
        console.log("❌ No user context available");
        setIsLoading(false);
        return;
      }

      console.log("✅ User context available:", context.user.fid);
      
      try {
        // Get or create user in database
        let user = await getUserByFid(context.user.fid);
        
        if (!user) {
          console.log("Creating new user for FID:", context.user.fid);
          user = await createOrUpdateUser({
            fid: context.user.fid,
            username: `user_${context.user.fid}`,
            display_name: `User ${context.user.fid}`,
          });
        }

        setDbUser(user);
      } catch (error) {
        console.error("Error handling user context:", error);
      }
      
      setIsLoading(false);
    };

    handleUserContext();
  }, [context?.user?.fid]);

  const refreshUser = async () => {
    if (!context?.user?.fid) return;
    
    setIsLoading(true);
    try {
      const user = await getUserByFid(context.user.fid);
      setDbUser(user);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
    setIsLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        dbUser,
        setDbUser,
        isLoading,
        refreshUser,
        fid: context?.user?.fid || null,
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
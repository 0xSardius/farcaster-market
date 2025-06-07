"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { sdk } from "@farcaster/frame-sdk";

interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  bio?: string;
}

interface UserContextType {
  dbUser: User | null;
  setDbUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        // Get user context from Farcaster Frame SDK
        const context = await sdk.context;

        if (context?.user) {
          const user: User = {
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
            bio: context.user.bio,
          };
          setDbUser(user);
        }
      } catch (error) {
        console.log("Not in Farcaster context:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ dbUser, setDbUser, isLoading }}>
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

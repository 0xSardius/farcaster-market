"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  id: string;
}

interface UserContextType {
  dbUser: User | null;
  setDbUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [dbUser, setDbUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ dbUser, setDbUser }}>
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

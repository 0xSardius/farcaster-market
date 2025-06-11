"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { UserProvider } from "@/context/UserContext-minimal";

// Define base chain inline
const base = {
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
  },
};

export function ProvidersMinimal({ children }: { children: React.ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "light",
          theme: "base",
          name: "Farcaster Market",
          logo: "/logo.png",
        },
      }}
    >
      <UserProvider>
        <div className="min-h-screen bg-white">{children}</div>
      </UserProvider>
    </MiniKitProvider>
  );
} 
"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
// Removed ThirdwebProvider - MiniKit handles wallet management
import { UserProvider } from "@/context/UserContext-clean";

export function ProvidersClean({ children }: { children: React.ReactNode }) {
  const baseChain = {
    id: 8453, // Base mainnet
    name: 'Base',
    network: 'base',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.base.org'] },
      public: { http: ['https://mainnet.base.org'] },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://basescan.org' },
    },
  };

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseChain}
      config={{
        appearance: {
          mode: "light",
          theme: "base",
          name: "Farcaster Market",
          logo: "/logo.png",
        },
      }}
    >
      <MiniKitProvider chain={baseChain}>
        <UserProvider>
          <div className="min-h-screen bg-white">{children}</div>
        </UserProvider>
      </MiniKitProvider>
    </OnchainKitProvider>
  );
} 
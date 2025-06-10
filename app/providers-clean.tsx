"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Base } from "@thirdweb-dev/chains";
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
        {/* Thirdweb for contract interactions only - no wallet connection */}
        <ThirdwebProvider
          activeChain={Base}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          supportedChains={[Base]}
          // Don't auto-connect wallet - let MiniKit handle that
          autoConnect={false}
          supportedWallets={[]}
        >
          <UserProvider>
            <div className="min-h-screen bg-white">{children}</div>
          </UserProvider>
        </ThirdwebProvider>
      </MiniKitProvider>
    </OnchainKitProvider>
  );
} 
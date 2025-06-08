"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Base } from "@thirdweb-dev/chains";
import { UserProvider } from "@/context/UserContext";
import { useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

// Configure wagmi with MiniKit-compatible settings
const config = createConfig({
  chains: [Base],
  connectors: [
    coinbaseWallet({
      appName: "Farcaster Market",
      preference: "smartWalletOnly",
    }),
  ],
  transports: {
    [Base.chainId]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <ThirdwebProvider
          activeChain={Base}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          supportedChains={[Base]}
        >
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={Base}
            config={{
              appearance: {
                name: "Farcaster Market",
                logo: "/logo.png",
                mode: "light",
                theme: "base",
              },
            }}
          >
            <UserProvider>
              <div className="min-h-screen bg-white">{children}</div>
            </UserProvider>
          </MiniKitProvider>
        </ThirdwebProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

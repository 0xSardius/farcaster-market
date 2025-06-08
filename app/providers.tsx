"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Base } from "@thirdweb-dev/chains";
import { UserProvider } from "@/context/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
      <ThirdwebProvider
        activeChain={Base}
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        supportedChains={[Base]}
      >
        <UserProvider>
          <div className="min-h-screen bg-white">{children}</div>
        </UserProvider>
      </ThirdwebProvider>
    </MiniKitProvider>
  );
}

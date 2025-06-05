"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        activeChain={base}
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        theme="light"
      >
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              name: "Farcaster Market",
              logo: "/logo.png",
              mode: "light",
              theme: "base",
            },
          }}
        >
          <div className="min-h-screen bg-white">{children}</div>
        </MiniKitProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

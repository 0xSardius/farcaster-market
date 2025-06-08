"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";

export function WalletConnect() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    const connector = connectors[0];
    if (connector) {
      try {
        await connect({ connector });
      } catch (error) {
        console.log("Connection failed:", error);
      }
    }
  };

  if (isConnecting || isPending) {
    return (
      <Button disabled>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        CONNECTING...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-xs">
          <span className="font-black">WALLET:</span> {address.slice(0, 6)}...
          {address.slice(-4)}
        </div>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          DISCONNECT
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect}>
      <Wallet className="w-4 h-4 mr-2" />
      CONNECT WALLET
    </Button>
  );
}

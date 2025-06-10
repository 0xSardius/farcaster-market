"use client";

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useUser } from "@/context/UserContext-clean";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";

export default function TestClean() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const { dbUser, isLoading } = useUser();
  const { address, isConnected, connectWallet } = useWallet();

  // Initialize MiniKit frame when interface is ready
  useEffect(() => {
    if (!isFrameReady) {
      console.log("🚀 Setting frame ready...");
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-black uppercase">Clean MiniKit Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 border-2 border-black">
            <h2 className="text-xl font-black mb-2">Frame Status</h2>
            <p>Frame Ready: {isFrameReady ? "✅" : "❌"}</p>
            <p>Context Available: {context ? "✅" : "❌"}</p>
            <p>User Context: {context?.user ? "✅" : "❌"}</p>
          </div>

          <div className="p-4 border-2 border-black">
            <h2 className="text-xl font-black mb-2">User Status</h2>
            <p>Loading: {isLoading ? "✅" : "❌"}</p>
            <p>DB User: {dbUser ? "✅" : "❌"}</p>
            {dbUser && (
              <div className="mt-2 text-sm">
                <p>Name: {dbUser.display_name || dbUser.username}</p>
                <p>FID: {dbUser.fid}</p>
              </div>
            )}
          </div>

          <div className="p-4 border-2 border-black">
            <h2 className="text-xl font-black mb-2">Wallet Status</h2>
            <p>Connected: {isConnected ? "✅" : "❌"}</p>
            <p>Address: {address || "None"}</p>
            <Button 
              onClick={connectWallet}
              className="mt-2"
              disabled={isConnected}
            >
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>
          </div>

          <div className="p-4 border-2 border-black">
            <h2 className="text-xl font-black mb-2">Environment Info</h2>
            <div className="text-sm space-y-1">
              <p>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'server'}</p>
              <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'server'}</p>
              <p>In Frame: {typeof window !== 'undefined' && window !== window.parent ? "✅" : "❌"}</p>
            </div>
          </div>

          <div className="p-4 border-2 border-black">
            <h2 className="text-xl font-black mb-2">Next Steps</h2>
            <div className="text-sm space-y-2">
              <p>1. Deploy this to production to test in actual Farcaster frame</p>
              <p>2. Use OnchainKit Transaction components for marketplace interactions</p>
              <p>3. Keep Thirdweb SDK for reading marketplace contract data</p>
              <p>4. Remove wagmi dependency if this approach works</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
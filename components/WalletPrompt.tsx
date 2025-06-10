"use client";

import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export function WalletPrompt() {
  const { dbUser, walletAddress } = useUser();

  // Don't show if no user or wallet already connected
  if (!dbUser || walletAddress) return null;

  return (
    <Card className="border-4 border-orange-500 bg-orange-50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Wallet className="w-8 h-8 text-orange-600" />
          <div>
            <h3 className="font-black uppercase">CONNECT YOUR WALLET</h3>
            <p className="text-sm text-gray-600">
              Complete your setup to start trading NFTs
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            <strong>Hi {dbUser.display_name || dbUser.username}!</strong> 
            You're signed in with Farcaster. Now connect your wallet to:
          </p>
          
          <ul className="text-sm space-y-1 text-gray-600 ml-4">
            <li>• Buy and sell NFTs</li>
            <li>• List your existing NFTs</li>
            <li>• Track your trading activity</li>
          </ul>
          
          <div className="pt-2">
            <WalletConnect />
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Your wallet will be securely linked to your Farcaster account
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 
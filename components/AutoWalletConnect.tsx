"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useAccount, useConnect } from 'wagmi';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export function AutoWalletConnect() {
  const { dbUser } = useUser();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  useEffect(() => {
    // Auto-connect wallet when user authenticates with Farcaster
    if (dbUser && !isConnected && !hasAttemptedConnection) {
      console.log("🚀 Auto-connecting wallet for authenticated Farcaster user...");
      
      // Try to connect with Coinbase Wallet first (recommended for Farcaster users)
      const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWallet');
      const injectedConnector = connectors.find(c => c.id === 'injected');
      
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector });
      } else if (injectedConnector) {
        connect({ connector: injectedConnector });
      } else if (connectors.length > 0) {
        // Fallback to first available connector
        connect({ connector: connectors[0] });
      }
      
      setHasAttemptedConnection(true);
    }
  }, [dbUser, isConnected, hasAttemptedConnection, connect, connectors]);

  // Reset attempt flag when user signs out
  useEffect(() => {
    if (!dbUser) {
      setHasAttemptedConnection(false);
    }
  }, [dbUser]);

  return null; // This component only handles auto-connection logic
} 
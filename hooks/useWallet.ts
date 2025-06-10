"use client";

import { useCallback, useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

interface WalletState {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnecting: false,
    isConnected: false,
    error: null,
  });

  const { isFrameReady } = useMiniKit();

  // In a real MiniKit environment, wallet connection is automatic
  // This hook provides a consistent interface for wallet state
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (!isFrameReady) {
        return;
      }

      try {
        setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));
        
        // In production MiniKit environment, the wallet is automatically connected
        // For now, we'll simulate this or rely on OnchainKit's built-in functionality
        
        console.log("🔍 Checking wallet connection in MiniKit environment");
        
        // Note: In a real MiniKit frame, the wallet address would be available
        // through transaction callbacks or other OnchainKit hooks
        
        setWalletState(prev => ({ 
          ...prev, 
          isConnecting: false,
          // We'll update this when we get actual wallet data
        }));
        
      } catch (error) {
        console.error("Wallet connection error:", error);
        setWalletState(prev => ({ 
          ...prev, 
          isConnecting: false, 
          error: error instanceof Error ? error.message : "Unknown error"
        }));
      }
    };

    checkWalletConnection();
  }, [isFrameReady]);

  const connectWallet = useCallback(async () => {
    // In MiniKit, wallet connection is handled automatically
    // This function is here for interface consistency
    console.log("🔄 MiniKit handles wallet connection automatically");
    return true;
  }, []);

  const disconnectWallet = useCallback(async () => {
    setWalletState({
      address: null,
      isConnecting: false,
      isConnected: false,
      error: null,
    });
  }, []);

  // Function to manually set wallet address when we get it from other sources
  const setWalletAddress = useCallback((address: string | null) => {
    setWalletState(prev => ({
      ...prev,
      address,
      isConnected: !!address,
    }));
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    setWalletAddress,
  };
} 
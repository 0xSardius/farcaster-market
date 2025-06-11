"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useState, useEffect } from "react";

export function useSafeMiniKit() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only use MiniKit on client side
  if (!isMounted) {
    return {
      setFrameReady: () => {},
      isFrameReady: false,
      context: null,
    };
  }

  try {
    return useMiniKit();
  } catch (error) {
    console.warn("MiniKit not available:", error);
    return {
      setFrameReady: () => {},
      isFrameReady: false,
      context: null,
    };
  }
} 
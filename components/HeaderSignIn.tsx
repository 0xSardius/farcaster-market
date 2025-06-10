"use client";

import { useAuthenticate } from "@coinbase/onchainkit/minikit";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useState } from "react";

export function HeaderSignIn() {
  const { signIn } = useAuthenticate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signIn();
      if (result) {
        console.log('✅ Authenticated with Farcaster:', result);
      }
    } catch (error) {
      console.error('❌ Farcaster authentication failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isSigningIn}
      size="sm"
      className="text-xs font-black uppercase"
    >
      {isSigningIn ? (
        "SIGNING IN..."
      ) : (
        <>
          <User className="w-3 h-3 mr-1" />
          SIGN IN
        </>
      )}
    </Button>
  );
} 
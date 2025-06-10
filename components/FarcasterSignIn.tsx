"use client";

import { useAuthenticate } from "@coinbase/onchainkit/minikit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Loader2 } from "lucide-react";
import { useState } from "react";

export function FarcasterSignIn() {
  const { signIn } = useAuthenticate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signIn();

      if (result) {
        console.log('✅ Authenticated with Farcaster:', result);
        // The UserContext will automatically pick up the authentication
      }
    } catch (error) {
      console.error('❌ Farcaster authentication failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Card className="border-4 border-blue-500 bg-blue-50">
      <CardContent className="p-6 text-center">
        <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-black uppercase mb-2">SIGN IN WITH FARCASTER</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect your Farcaster account to access all features
        </p>
        <Button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="font-black uppercase w-full"
        >
          {isSigningIn ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              SIGNING IN...
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              SIGN IN WITH FARCASTER
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-3">
          This will open a secure Farcaster authentication dialog
        </p>
      </CardContent>
    </Card>
  );
} 
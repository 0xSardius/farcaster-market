"use client";

import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';

export function WalletConnect() {
  const handleWalletConnect = () => {
    console.log("💳 Wallet connected automatically after Farcaster auth");
    // Optional: Add any post-connection logic here
  };

  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet onConnect={handleWalletConnect}>
          <Avatar className="h-8 w-8 border-2 border-black" />
          <Name className="text-sm font-black uppercase" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity 
            className="px-4 pt-3 pb-2" 
            hasCopyAddressOnClick
          >
            <Avatar className="h-12 w-12 border-2 border-black" />
            <Name className="font-black" />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownLink 
            icon="wallet" 
            href="https://keys.coinbase.com"
            target="_blank"
          >
            Wallet
          </WalletDropdownLink>
          <WalletDropdownFundLink />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}

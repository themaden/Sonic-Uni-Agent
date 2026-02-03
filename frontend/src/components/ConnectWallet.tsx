'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();

  // Use "injected" connector as a default for Metamask/Browser Wallets
  // In a real app with RainbowKit properly set up in layout, "ConnectButton" from RainbowKit is better
  // But here we'll stick to a simple custom button triggering the first available connector
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      const connector = connectors[0]; // Usually Injected (Metamask)
      connect({ connector });
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-all font-mono text-sm backdrop-blur-md"
    >
      <Wallet size={16} className="text-sonic-cyan" />
      {isConnected && address
        ? <span className="text-sonic-cyan">{address.slice(0, 6)}...{address.slice(-4)}</span>
        : "Connect Wallet"
      }
    </button>
  );
}
'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VoiceInput from '@/src/components/VoiceInput';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount(); // Check if wallet is connected
  const [intent, setIntent] = useState<any>(null); // Command from AI

  return (
    <main className="flex min-h-screen flex-col items-center pt-24 bg-black text-white relative overflow-hidden px-4">
      
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black -z-10"></div>

      {/* Header */}
      <div className="text-center space-y-4 mb-10 z-10">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
          Sonic Uni-Agent
        </h1>
        <p className="text-xl text-gray-400">
          Voice-Controlled Cross-Chain DeFi Orchestrator
        </p>
      </div>

      {/* Wallet Button */}
      <div className="mb-12 scale-110">
        <ConnectButton label="Connect Wallet to Start" />
      </div>

      {/* Logic: Show microphone if wallet is connected, otherwise hide */}
      {isConnected ? (
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* MICROPHONE COMPONENT */}
            {!intent && (
                <VoiceInput onIntentReady={(data) => setIntent(data)} />
            )}

            {/* INTENT CARD (Opens when AI responds) */}
            {intent && (
                <div className="bg-gray-900/80 border border-gray-700 p-8 rounded-3xl backdrop-blur-xl">
                    <h2 className="text-2xl font-bold mb-6 text-green-400">🚀 AI Agent Plan Prepared</h2>
                    
                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div className="p-4 bg-black/40 rounded-xl">
                            <p className="text-gray-500 text-sm">Action</p>
                            <p className="text-xl font-mono text-white">{intent.action}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl">
                            <p className="text-gray-500 text-sm">Route</p>
                            <p className="text-xl font-mono text-white">{intent.source_chain} → {intent.target_chain}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl">
                            <p className="text-gray-500 text-sm">Amount</p>
                            <p className="text-xl font-mono text-yellow-400">{intent.amount} {intent.token_in}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-green-900/50">
                            <p className="text-gray-500 text-sm">Confidence</p>
                            <p className="text-xl font-mono text-green-400">98% (Verified)</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIntent(null)}
                            className="flex-1 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => alert("Transacting on Blockchain... (Coming Next Step!)")}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-bold shadow-lg shadow-blue-900/50 transition-all"
                        >
                            Sign & Execute ⚡
                        </button>
                    </div>
                </div>
            )}

        </div>
      ) : (
        <div className="mt-8 text-gray-600 animate-pulse">
            Waiting for wallet connection...
        </div>
      )}

    </main>
  );
}
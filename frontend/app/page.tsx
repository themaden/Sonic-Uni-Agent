'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VoiceInput from '@/src/components/VoiceInput';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Loader2, CheckCircle, ExternalLink } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const [intent, setIntent] = useState<any>(null);
  
  // WAGMI Hooks for Blockchain Interaction
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  
  // Wait for transaction confirmation on-chain
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Function to trigger the wallet
  const handleExecute = async () => {
    if (!intent) return;

    // SIMULATION: In a real scenario, we would call the Smart Contract function.
    // For the demo, we send a small amount of ETH to simulate the "Bridge Fee" or "Swap".
    sendTransaction({
      to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Test Account (or Contract Address)
      value: parseEther('0.0001'), // 0.0001 ETH Cost
    });
  };

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

      {isConnected ? (
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            
            {/* 1. MIKROFON (İşlem yapılmadıysa göster) */}
            {!intent && !hash && (
                <VoiceInput onIntentReady={(data) => setIntent(data)} />
            )}

            {/* 2. INTENT KARTI (AI Onayı) */}
            {intent && !hash && (
                <div className="bg-gray-900/80 border border-gray-700 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                        <span className="animate-pulse">●</span> AI Agent Plan Prepared
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div className="p-4 bg-black/40 rounded-xl">
                            <p className="text-gray-500 text-sm">Action</p>
                            <p className="text-xl font-mono text-white">{intent.action}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl">
                            <p className="text-gray-500 text-sm">Route</p>
                            <p className="text-xl font-mono text-white">{intent.source_chain} ➝ {intent.target_chain}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl">
                            <p className="text-gray-500 text-sm">Amount</p>
                            <p className="text-xl font-mono text-yellow-400">{intent.amount} {intent.token_in}</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-green-900/50">
                            <p className="text-gray-500 text-sm">Fees (Est.)</p>
                            <p className="text-xl font-mono text-green-400">0.0001 ETH</p>
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
                            onClick={handleExecute}
                            disabled={isPending}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-bold shadow-lg shadow-blue-900/50 transition-all flex justify-center items-center gap-2"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : "Sign & Execute ⚡️"}
                        </button>
                    </div>
                </div>
            )}

            {/* 3. İŞLEM DURUMU (Transaction Status) */}
            {hash && (
                <div className="bg-gray-900/80 border border-blue-900 p-8 rounded-3xl backdrop-blur-xl text-center">
                    
                    {isConfirming && (
                        <div className="space-y-4">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
                            <h2 className="text-2xl font-bold text-white">Processing on Blockchain...</h2>
                            <p className="text-gray-400">Waiting for block confirmation</p>
                            <a 
                                href={`https://sepolia.etherscan.io/tx/${hash}`} 
                                target="_blank" 
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-2"
                            >
                                View on Etherscan <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    )}

                    {isConfirmed && (
                        <div className="space-y-4 animate-in zoom-in duration-500">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                            <h2 className="text-3xl font-bold text-white">Transaction Successful! 🎉</h2>
                            <p className="text-gray-400">Your assets have been bridged via Sonic Agent.</p>
                            
                            <div className="p-4 bg-green-900/20 rounded-xl border border-green-800 mt-4">
                                <p className="font-mono text-green-300 break-all">{hash}</p>
                            </div>

                            <button 
                                onClick={() => { setIntent(null); window.location.reload(); }}
                                className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200"
                            >
                                Start New Command
                            </button>
                        </div>
                    )}

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
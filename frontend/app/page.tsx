'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VoiceInput from '@/src/components/VoiceInput'; // Previous voice input
import TransactionModal from '@/src/components/TransactionModal';
import LiveLogs from '@/src/components/LiveLogs';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Radio } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const [intent, setIntent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');

  // WAGMI Hooks
  const { data: hash, sendTransaction } = useSendTransaction();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const processVoiceCommand = async (text: string) => {
    setStatus('processing');
    try {
      const response = await fetch('http://localhost:8080/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setIntent(data.intent);
      } else {
        console.error("AI Error:", data.error);
        alert("Sorry, I didn't understand that.");
        setStatus('idle');
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to the agent.");
      setStatus('idle');
    }
  };

  const handleExecute = async () => {
    // Demo Transaction
    sendTransaction({
      to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      value: parseEther('0.0001'),
    });
    setIntent(null); // Close modal
    setStatus('idle');
  };

  return (
    <main className="min-h-screen bg-sonic-dark text-white relative overflow-hidden selection:bg-sonic-cyan selection:text-black">

      {/* 1. Grid Background (as in the design) */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-cyber-gradient pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sonic-cyan/10 rounded border border-sonic-cyan/20">
            <Radio className="text-sonic-cyan animate-pulse" size={20} />
          </div>
          <div>
            <h1 className="font-bold tracking-[0.2em] text-lg text-white">SONIC_UNI_AGENT</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Premium Voice Interface</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-sonic-cyan">
            <span className="w-2 h-2 bg-sonic-cyan rounded-full animate-ping"></span>
            SYSTEM ONLINE
          </div>
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative z-10">

        {isConnected ? (
          <>
            {/* Status Indicator */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono tracking-widest uppercase">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening Mode Active
              </div>
            </div>

            {/* MICROPHONE CENTER */}
            {!intent && (
              <div className="w-full flex justify-center z-50 relative">
                <VoiceInput
                  status={status}
                  setStatus={setStatus}
                  onIntentDetected={processVoiceCommand}
                />
              </div>
            )}

            {/* Voice Command (Transcribed) */}
            <div className="mt-8 text-center space-y-4 max-w-2xl px-4 min-h-[100px]">
              {/* VoiceInput component above handles the interaction */}
            </div>

            {/* MODAL (Confirmation Screen) */}
            {intent && (
              <TransactionModal
                intent={intent}
                onConfirm={handleExecute}
                onCancel={() => {
                  setIntent(null);
                  setStatus('idle');
                }}
              />
            )}

            {/* BOTTOM RIGHT LOG BOX */}
            <LiveLogs status={status} />

          </>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
            <p className="text-gray-500 tracking-widest uppercase text-sm">Waiting for Neural Link...</p>
          </div>
        )}

      </div>
    </main>
  );
}
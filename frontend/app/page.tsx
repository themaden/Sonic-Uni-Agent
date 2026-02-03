'use client';

import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import VoiceInput from '@/src/components/VoiceInput';
import TransactionModal from '@/src/components/TransactionModal';
import ConnectWallet from '@/src/components/ConnectWallet';
import { resolveENSProfile } from '@/src/utils/ens'; // Ensure this path is correct

export default function Home() {
  const [intent, setIntent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handleVoiceIntent = async (text: string) => {
    console.log("🚀 Sending to Backend:", text);

    if (!address) {
      alert("Please connect your wallet first!");
      return;
    }

    setErrorMsg('');
    setStatus('processing');

    try {
      // 1. Send Request to Go Backend
      const response = await fetch('http://localhost:8080/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, address: address })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Backend Response:", data);

      // --- ENS INTEGRATION START ---
      let recipientAddress = data.recipient || '0x...';
      let recipientAvatar = null;
      let recipientName = null;

      // Check if the text contains an ENS name (e.g., vitalik.eth)
      const ensMatch = text.match(/[a-zA-Z0-9-]+\.eth/i);

      if (ensMatch) {
        const ensName = ensMatch[0];
        console.log("🔍 ENS Detected:", ensName);

        // Resolve ENS Profile
        const profile = await resolveENSProfile(ensName);

        if (profile) {
          console.log("✅ ENS Resolved:", profile);
          recipientAddress = profile.address;
          recipientAvatar = profile.avatar; // URL of the avatar
          recipientName = profile.name;     // e.g., vitalik.eth
        }
      }
      // --- ENS INTEGRATION END ---

      // Prepare Data for Modal
      setIntent({
        action: data.action || 'TRANSFER',
        source_chain: data.source_chain || 'ETHEREUM',
        target_chain: data.target_chain || 'ETHEREUM',
        amount: data.amount || text.match(/[0-9]*\.?[0-9]+/)?.[0] || '0.0001',
        token_in: data.token_in || 'ETH',

        // ENS / Identity Fields
        recipient_address: recipientAddress,
        recipient_avatar: recipientAvatar,
        recipient_name: recipientName,

        original_text: text,
        ...data
      });

      setStatus('idle'); // Open Modal

    } catch (err: any) {
      console.error("❌ Error:", err);
      setErrorMsg("Transaction failed. Is the backend running?");
      setStatus('idle');
    }
  };

  const executeTransaction = () => {
    if (!intent) return;

    console.log("🚀 Executing Transaction for:", intent);

    try {
      const targetAddress = intent.recipient_address !== '0x...'
        ? intent.recipient_address
        : "0x000000000000000000000000000000000000dEaD"; // Default Dummy

      const isEth = !intent.token_in || intent.token_in.toUpperCase() === 'ETH';
      const amountToSend = intent.amount ? intent.amount.toString() : "0";

      sendTransaction({
        to: targetAddress,
        value: isEth ? parseEther(amountToSend) : parseEther("0"), // Send 0 if not ETH (demo mode)
      }, {
        onSuccess: (hash) => {
          console.log("Transaction Sent:", hash);
          alert(`Transaction Sent! Hash: ${hash}`);
          setIntent(null);
        },
        onError: (error) => {
          console.error("Tx Error:", error);
          alert("User rejected operation or error occurred.");
        }
      });

    } catch (e) {
      console.error("Execution Error:", e);
      alert("Failed to initiate transaction.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-sonic-cyan selection:text-black font-sans overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sonic-cyan/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 relative z-10 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-sonic-cyan to-blue-600 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center justify-center">
            <span className="font-bold text-black text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            SONIC<span className="text-sonic-cyan">AGENT</span>
          </h1>
        </div>
        <ConnectWallet />
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] relative z-10 px-4">

        <div className="text-center mb-12 space-y-4 max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            DeFi at the Speed of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sonic-cyan via-blue-400 to-purple-500 animate-pulse">
              SOUND
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light">
            Just speak. We handle the bridge, swap, and execution.
          </p>
        </div>

        {/* Voice Input Module */}
        <div className="w-full max-w-lg relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sonic-cyan to-purple-600 rounded-2xl blur opacity-30 animate-tilt"></div>
          <div className="relative bg-black border border-white/10 rounded-2xl p-8 shadow-2xl">
            <VoiceInput
              onIntentDetected={handleVoiceIntent}
              status={status}
              setStatus={setStatus}
            />

            {status === 'processing' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sonic-cyan animate-pulse">
                <div className="w-2 h-2 bg-sonic-cyan rounded-full"></div>
                <span className="text-sm font-mono uppercase tracking-widest">Processing Intent...</span>
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-center text-sm">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Footer Badges */}
        <div className="mt-16 flex gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xs font-mono text-gray-500 border border-gray-800 px-3 py-1 rounded hover:border-sonic-cyan hover:text-sonic-cyan cursor-default">Powered by YELLOW</span>
          <span className="text-xs font-mono text-gray-500 border border-gray-800 px-3 py-1 rounded hover:border-blue-400 hover:text-blue-400 cursor-default">Secured by SUI</span>
          <span className="text-xs font-mono text-gray-500 border border-gray-800 px-3 py-1 rounded hover:border-pink-500 hover:text-pink-500 cursor-default">Hooked on UNISWAP</span>
        </div>

      </div>

      {/* Transaction Modal */}
      <TransactionModal
        intent={intent}
        onConfirm={executeTransaction}
        onCancel={() => setIntent(null)}
      />
    </main>
  );
}
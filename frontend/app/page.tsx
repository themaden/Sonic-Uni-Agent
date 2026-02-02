'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VoiceInput from '@/src/components/VoiceInput'; // Önceki voice input'u
import TransactionModal from '@/src/components/TransactionModal';
import LiveLogs from '@/src/components/LiveLogs';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Mic, Radio } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const [intent, setIntent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  
  // WAGMI Hooks
  const { data: hash, sendTransaction } = useSendTransaction();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleExecute = async () => {
    // Demo Transaction
    sendTransaction({
      to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 
      value: parseEther('0.0001'), 
    });
    setIntent(null); // Modalı kapat
  };

  return (
    <main className="min-h-screen bg-sonic-dark text-white relative overflow-hidden selection:bg-sonic-cyan selection:text-black">
      
      {/* 1. Grid Arka Plan (Resimdeki gibi) */}
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

      {/* Ana İçerik */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative z-10">
        
        {isConnected ? (
          <>
            {/* Durum Göstergesi */}
            <div className="mb-12">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono tracking-widest uppercase">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Listening Mode Active
               </div>
            </div>

            {/* MİKROFON MERKEZİ */}
            {!intent && (
                <div className="relative group cursor-pointer" onClick={() => setStatus('listening')}>
                    {/* Glow Efektleri */}
                    <div className="absolute -inset-10 bg-sonic-cyan/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="absolute -inset-1 bg-gradient-to-b from-sonic-cyan to-sonic-purple rounded-full opacity-50 blur"></div>
                    
                    {/* Asıl Daire */}
                    <div className="relative w-32 h-32 bg-gray-900 rounded-full border border-gray-700 flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-105">
                        <Mic className="w-10 h-10 text-white" />
                    </div>

                    {/* Halka Animasyonları (Listening durumunda) */}
                    {status === 'listening' && (
                        <>
                            <div className="absolute inset-0 rounded-full border border-sonic-cyan/30 animate-[ping_2s_linear_infinite]"></div>
                            <div className="absolute -inset-4 rounded-full border border-sonic-purple/20 animate-[ping_3s_linear_infinite_delay-100]"></div>
                        </>
                    )}
                </div>
            )}

            {/* Sesli Komut (Yazıya Dökülen) */}
            <div className="mt-16 text-center space-y-4 max-w-2xl px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 leading-tight">
                    "Bridge <span className="text-sonic-cyan">100 USDC</span> from <br/> Sui to Sepolia"
                </h2>
                <p className="text-sonic-purple/80 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
                    ———— Processing Intent ————
                </p>
                
                {/* Geçici Buton (Demo için, normalde ses tetikler) */}
                <button 
                    onClick={() => {
                        setStatus('processing');
                        setTimeout(() => {
                            setIntent({
                                action: 'BRIDGE ASSETS',
                                source_chain: 'SEPOLIA',
                                target_chain: 'SUI NET',
                                amount: 100,
                                token_in: 'USDC',
                                original_text: "Bridge 100 USDC from Sepolia to Sui"
                            });
                        }, 2000);
                    }}
                    className="mt-8 px-6 py-2 border border-gray-700 rounded text-xs text-gray-500 hover:text-white hover:border-white transition"
                >
                    [DEBUG: Simulate Voice Command]
                </button>
            </div>

            {/* MODAL (Onay Ekranı) */}
            {intent && (
                <TransactionModal 
                    intent={intent}
                    onConfirm={handleExecute}
                    onCancel={() => setIntent(null)}
                />
            )}

            {/* SAĞ ALT LOG KUTUSU */}
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
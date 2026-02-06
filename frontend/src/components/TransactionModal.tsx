import { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, Zap, Activity, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';

interface TransactionModalProps {
  intent: any;
  txHash?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TransactionModal({ intent, txHash, onConfirm, onCancel }: TransactionModalProps) {
  // Internal state management (Review -> Processing -> Success)
  // TIP: Set this to 'success' during development to style the success screen without refreshing.
  const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');

  useEffect(() => {
    if (txHash && step === 'processing') {
      setStep('success');
    }
  }, [txHash, step]);

  if (!intent) return null;

  // Function to execute when "Confirm" is clicked
  const handleExecute = async () => {
    setStep('processing');

    // Trigger the actual transaction from parent (page.tsx)
    onConfirm();

    /* 
       Note: The step will transition to 'success' automatically via the useEffect 
       above once txHash is received from the parent component.
    */
  };

  // Close Function
  const handleClose = () => {
    setStep('review');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-sonic-cyan/50 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden relative transform transition-all scale-100">

        {/* --- STATE 1: SUCCESS SCREEN --- */}
        {step === 'success' && (
          <div className="p-8 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300">

            {/* 1. SUCCESS ICON */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
              {intent.recipient_avatar ? (
                <div className="relative">
                  <img
                    src={intent.recipient_avatar}
                    className="w-32 h-32 rounded-full border-4 border-green-500 object-cover shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                    alt="Recipient Avatar"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-black px-2 py-1 rounded-lg text-xs font-black border-2 border-black z-20 shadow-lg">ENS</div>
                </div>
              ) : (
                <img
                  src="/images/success_3d.png"
                  className="w-32 h-32 rounded-full border-2 border-green-500 object-cover animate-bounce-subtle shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                  alt="Success 3D"
                />
              )}
            </div>

            {/* 2. HEADER */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">MISSION ACCOMPLISHED</h2>
              <p className="text-gray-400 text-sm mt-1">Funds have been bridged & sent successfully.</p>
            </div>

            {/* 3. ENS RECIPIENT CARD */}
            <div className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"></div>

              {/* AVATAR (ENS Avatar or Placeholder) */}
              <div className="relative z-10">
                {intent.recipient_avatar ? (
                  <img
                    src={intent.recipient_avatar}
                    className="w-14 h-14 rounded-full border-2 border-green-400 object-cover shadow-lg"
                    alt="Recipient Avatar"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border border-gray-600 shadow-inner group">
                    <span className="text-[10px] font-black text-sonic-cyan tracking-tighter uppercase font-mono group-hover:scale-110 transition-transform">USER</span>
                  </div>
                )}
                {intent.recipient_avatar && (
                  <div className="absolute -bottom-1 -right-1 bg-black text-[8px] px-1 rounded border border-gray-600 text-white font-bold">ENS</div>
                )}
              </div>

              {/* NAME AND ADDRESS */}
              <div className="text-left z-10">
                <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-wider">Recipient</p>
                <p className="text-lg font-bold text-white leading-none">
                  {intent.recipient_name || 'Verified Recipient'}
                </p>
                <p className="text-xs text-green-400 font-mono mt-1 opacity-80">
                  {intent.recipient_address && intent.recipient_address !== '0x...'
                    ? `${intent.recipient_address.slice(0, 6)}...${intent.recipient_address.slice(-4)}`
                    : 'Address Ready'}
                </p>
              </div>
            </div>

            {/* 4. TRANSACTION HASH */}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-black/40 rounded p-3 border border-gray-800 flex justify-between items-center group cursor-pointer hover:border-gray-600 transition"
            >
              <div className="text-left">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Transaction Hash</p>
                <p className="text-xs text-sonic-cyan font-mono truncate max-w-[200px]">
                  {txHash || '0x4541692843db8c6f2a9070f33c03a4c89bbd0639889b4d05ba13b954d2824137'}
                </p>
              </div>
              <ExternalLink size={14} className="text-gray-500 group-hover:text-white" />
            </a>

            {/* 5. CLOSE BUTTON */}
            <button
              onClick={handleClose}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all active:scale-[0.98]"
            >
              Close Window
            </button>
          </div>
        )}

        {/* --- STATE 2: PROCESSING (EXECUTING) --- */}
        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center space-y-6 text-center h-[450px]">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-gray-800 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-sonic-cyan border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="text-sonic-cyan animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white animate-pulse tracking-widest">EXECUTING INTENT</h3>
              <p className="text-sm text-gray-400">Aggregating liquidity via Yellow Network</p>
              <p className="text-xs text-gray-600 font-mono">Bridging assets to destination chain...</p>
            </div>
          </div>
        )}

        {/* --- STATE 3: REVIEW (INITIAL MODAL) --- */}
        {step === 'review' && (
          <>
            {/* Top Glowing Animation Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sonic-cyan to-transparent animate-pulse"></div>

            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gray-900/80">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="text-sonic-cyan" size={20} />
                  CONFIRM INTENT
                </h2>
                <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">
                  INTENT ID: #{Math.floor(Math.random() * 99999)}
                </p>
              </div>
              <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">

              {/* Amount Display */}
              <div className="text-center py-5 bg-gray-800/30 rounded-xl border border-gray-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-sonic-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Total Amount</p>
                <div className="text-4xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                  {intent.amount} <span className="text-sonic-cyan">{intent.token_in || 'USDC'}</span>
                </div>
                <p className="text-green-400 text-[10px] mt-2 flex items-center justify-center gap-1 font-mono">
                  <Zap size={12} /> Optimized Route via LI.FI
                </p>
              </div>

              {/* Visual Execution Path */}
              <div className="relative p-6 rounded-lg border border-gray-700 bg-black/40">
                <p className="text-[9px] text-gray-500 uppercase mb-4 absolute top-2 left-3">Execution Path</p>

                <div className="flex items-center justify-between mt-2">
                  {/* Source Chain */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center border border-blue-500 mx-auto mb-2">
                      <span className="text-xs font-bold text-blue-400">ETH</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{intent.source_chain || 'SEPOLIA'}</p>
                  </div>

                  {/* Bridge Animation */}
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="w-full h-[1px] bg-gray-700 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-sonic-cyan to-transparent animate-[moveRight_1.5s_infinite_linear]"></div>
                    </div>
                    <div className="bg-sonic-cyan/10 px-2 py-0.5 rounded text-[8px] text-sonic-cyan border border-sonic-cyan/30 mt-2 font-mono uppercase tracking-tighter">
                      via LI.FI Aggregator
                    </div>
                  </div>

                  {/* Destination / ENS Profile */}
                  <div className="text-center flex flex-col items-center min-w-[90px]">
                    {intent.recipient_avatar ? (
                      <div className="relative group cursor-pointer">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-40 group-hover:opacity-100 transition"></div>
                        <img
                          src={intent.recipient_avatar}
                          alt="ENS Avatar"
                          className="relative w-14 h-14 rounded-full border-2 border-black object-cover z-10"
                        />
                        <div className="absolute -bottom-1 -right-1 z-20 bg-black text-[8px] text-white px-1 py-px rounded border border-gray-600 font-bold">ENS</div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400 mx-auto mb-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <span className="text-xs font-bold text-blue-300">SUI</span>
                      </div>
                    )}
                    <div className="mt-2 text-center">
                      <p className="text-xs text-white font-bold truncate max-w-[80px]">
                        {intent.recipient_name || intent.target_chain || 'SUI NETWORK'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Infrastructure Badges */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex items-center gap-2 bg-yellow-900/10 p-2.5 rounded border border-yellow-600/20 text-yellow-500">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                  Liquidity: Yellow
                </div>
                <div className="flex items-center gap-2 bg-purple-900/10 p-2.5 rounded border border-purple-500/20 text-purple-400">
                  <ShieldCheck size={12} />
                  Identity: ZK-Vault
                </div>
              </div>

            </div>

            {/* Main Action Button */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
              <button
                onClick={handleExecute}
                className="w-full py-4 bg-sonic-cyan hover:bg-cyan-400 text-black font-bold rounded-xl text-lg tracking-widest transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                EXECUTE CROSS-CHAIN <ArrowRight size={20} />
              </button>
            </div>
          </>
        )}

      </div>

      <style jsx>{`
        @keyframes moveRight {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
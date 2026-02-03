import { Fingerprint, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface ModalProps {
  intent: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TransactionModal({ intent, onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Card Itself */}
      <div className="relative w-full max-w-lg bg-sonic-card border border-sonic-purple/30 rounded-none shadow-[0_0_50px_rgba(188,19,254,0.15)] overflow-hidden">

        {/* Decorative Lines (Corners) */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sonic-cyan"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sonic-cyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sonic-cyan"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sonic-cyan"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sonic-purple/20 rounded-lg">
              <ShieldCheck className="text-sonic-purple w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wider text-sm">SYSTEM NOTIFICATION // T-XC-92</h3>
              <p className="text-xl font-bold text-white mt-1">CONFIRM TRANSACTION</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition">
            <X />
          </button>
        </div>

        {/* Voice Intent Badge */}
        <div className="px-6 py-4 bg-sonic-cyan/5 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sonic-cyan text-xs font-bold uppercase mb-1">
            <div className="w-2 h-2 bg-sonic-cyan rounded-full animate-pulse"></div>
            Voice Intent Verified
          </div>
          <p className="text-gray-300 italic">"{intent.original_text || 'Bridge 100 USDC from Sepolia to Sui'}"</p>
        </div>

        {/* Chains and Arrow */}
        <div className="p-8 grid grid-cols-3 items-center text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-sonic-cyan/50 flex items-center justify-center bg-black">
              {/* ETH Icon (Simple) */}
              <span className="text-2xl">🔷</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Source</p>
            <p className="font-bold text-white">{intent.source_chain || 'SEPOLIA'}</p>
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 bg-sonic-purple flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(188,19,254,0.5)]">
              <ArrowRight className="text-white" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-sonic-purple/50 flex items-center justify-center bg-black">
              {/* Sui Icon (Simple) */}
              <span className="text-2xl">💧</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Target</p>
            <p className="font-bold text-white">{intent.target_chain || 'SUI NET'}</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-8 pb-8 space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-900/50 border border-gray-800 rounded">
            <div>
              <p className="text-sonic-cyan text-xs uppercase font-bold mb-1">■ Action</p>
              <p className="text-white font-bold text-lg">{intent.action || 'BRIDGE ASSETS'}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs uppercase mb-1">Amount</p>
              <p className="text-sonic-cyan font-mono text-2xl font-bold">{intent.amount} {intent.token_in}</p>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 font-mono">
            <span>EST. NETWORK FEE: <span className="text-white">~0.005 ETH</span></span>
            <span>EST. LATENCY: <span className="text-sonic-green-400 text-green-400">&lt; 20s</span></span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onConfirm}
          className="w-full py-6 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 hover:bg-gray-800 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-sonic-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="flex items-center justify-center gap-3 relative z-10">
            <Fingerprint className="text-sonic-cyan w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold tracking-widest text-lg">SIGN TRANSACTION</span>
          </div>
        </button>

        <div className="bg-black py-1 text-center">
          <p className="text-[10px] text-sonic-cyan/40 tracking-[0.2em]">// SECURED BY SONIC UNI-AGENT</p>
        </div>

      </div>
    </div>
  );
}
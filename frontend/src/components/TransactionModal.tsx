import { X, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

interface TransactionModalProps {
  intent: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TransactionModal({ intent, onConfirm, onCancel }: TransactionModalProps) {
  if (!intent) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-sonic-cyan/50 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden relative transform transition-all scale-100">
        
        {/* Top Loading Bar Animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sonic-cyan to-transparent animate-pulse"></div>

        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gray-900/80">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="text-sonic-cyan" size={20} />
              CONFIRM TRANSACTION
            </h2>
            <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">
                INTENT ID: #{Math.floor(Math.random() * 99999)}
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* 1. AMOUNT DISPLAY */}
          <div className="text-center py-5 bg-gray-800/30 rounded-xl border border-gray-700/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-sonic-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Total Amount</p>
            <div className="text-4xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              {intent.amount} <span className="text-sonic-cyan">{intent.token_in || 'ETH'}</span>
            </div>
            <p className="text-green-400 text-[10px] mt-2 flex items-center justify-center gap-1 font-mono">
              <Zap size={12} /> Optimized Route via LI.FI
            </p>
          </div>

          {/* 2. VISUAL ROUTE (ENS / SUI Logic) */}
          <div className="relative p-4 rounded-lg border border-gray-700 bg-black/40">
            <p className="text-[9px] text-gray-500 uppercase mb-3 absolute top-2 left-3">Execution Path</p>
            
            <div className="flex items-center justify-between mt-2">
              
              {/* SOURCE (Left) */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center border border-blue-500 mx-auto mb-2">
                  <span className="text-xs font-bold text-blue-400">ETH</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{intent.source_chain}</p>
              </div>

              {/* BRIDGE ANIMATION (Center) */}
              <div className="flex-1 px-2 flex flex-col items-center">
                <div className="w-full h-[1px] bg-gray-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-sonic-cyan to-transparent animate-[moveRight_1.5s_infinite_linear]"></div>
                </div>
                <div className="bg-sonic-cyan/10 px-2 py-0.5 rounded text-[8px] text-sonic-cyan border border-sonic-cyan/30 mt-2 font-mono">
                  SOLVER: YELLOW
                </div>
              </div>

              {/* DESTINATION (Right - ENS or Chain Logo) */}
              <div className="text-center flex flex-col items-center min-w-[80px]">
                
                {intent.recipient_avatar ? (
                    // SHOW ENS AVATAR IF AVAILABLE
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-50 group-hover:opacity-100 transition"></div>
                        <img 
                          src={intent.recipient_avatar} 
                          alt="ENS Avatar" 
                          className="relative w-14 h-14 rounded-full border-2 border-black object-cover z-10"
                        />
                        <div className="absolute -bottom-1 -right-1 z-20 bg-black text-[8px] text-white px-1 py-px rounded border border-gray-700 font-bold">
                           ENS
                        </div>
                    </div>
                ) : (
                    // SHOW CHAIN LOGO IF NO AVATAR
                    <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center border border-purple-500 mx-auto mb-2">
                      <span className="text-xs font-bold text-purple-300">
                        {intent.target_chain ? intent.target_chain.substring(0,3) : 'DST'}
                      </span>
                    </div>
                )}

                {/* NAME AND ADDRESS */}
                <div className="mt-2">
                    <p className="text-xs text-white font-bold">
                        {intent.recipient_name || intent.target_chain}
                    </p>
                    {intent.recipient_address && intent.recipient_address !== '0x...' && (
                        <p className="text-[9px] text-gray-500 font-mono bg-gray-800/50 px-2 py-0.5 rounded-full mt-1 border border-gray-700 inline-block">
                            {intent.recipient_address.slice(0,6)}...{intent.recipient_address.slice(-4)}
                        </p>
                    )}
                </div>
              </div>

            </div>
          </div>

          {/* 3. TECHNICAL BADGES (Sponsors) */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="flex items-center gap-2 bg-yellow-900/10 p-2 rounded border border-yellow-600/20 text-yellow-500">
               <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
               Liquidity: Yellow Network
            </div>
            <div className="flex items-center gap-2 bg-purple-900/10 p-2 rounded border border-purple-500/20 text-purple-400">
               <ShieldCheck size={12} />
               ZK Proof Verified
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <button 
            onClick={onConfirm}
            className="w-full py-3.5 bg-sonic-cyan hover:bg-cyan-400 text-black font-bold rounded-lg text-lg tracking-widest transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            CONFIRM & SEND <ArrowRight size={20} />
          </button>
        </div>

      </div>
      
      {/* CSS Animation for the bridge line */}
      <style jsx>{`
        @keyframes moveRight {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
import { Terminal,Activity } from "lucide-react";

export default function LiveLogs({status}: {status: string}) {

    const getLogs = () => {
    if (status === 'listening') return [
      { time: '10:42:05', text: 'Daemon initialized.', color: 'text-gray-500' },
      { time: '10:42:08', text: '> Waiting for voice trigger...', color: 'text-sonic-cyan' },
    ];
    if (status === 'processing') return [
      { time: '10:42:12', text: '[AI] Parsing Intent: "Bridge asset"', color: 'text-sonic-purple' },
      { time: '10:42:13', text: '[GO] Route: SUI -> SEPOLIA (USDC)', color: 'text-yellow-400' },
      { time: '10:42:14', text: '[ZK] Voice Biometrics Verified', color: 'text-green-400' },
    ];
    return [];
  };
  return (
    <div className="absolute bottom-8 right-8 w-96 bg-sonic-card/90 border border-gray-800 rounded-lg p-4 font-mono text-xs shadow-2xl backdrop-blur-md hidden md:block">
      <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Terminal size={14} />
          <span className="uppercase tracking-wider">Live Execution Logs</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div>
      </div>
      
      <div className="space-y-2 h-32 overflow-hidden">
        {getLogs().map((log, i) => (
          <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-gray-600">{log.time}</span>
            <span className={log.color}>{log.text}</span>
          </div>
        ))}
        {status === 'processing' && (
             <div className="w-2 h-4 bg-sonic-cyan animate-pulse mt-1"></div>
        )}
      </div>
    </div>
  )
};
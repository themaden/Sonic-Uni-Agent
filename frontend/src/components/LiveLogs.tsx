import { useState, useEffect } from 'react';
import { Terminal, Brain, Cpu, Shield, Globe } from 'lucide-react';

interface Log {
  id: string;
  msg: string;
  type: 'ai' | 'engine' | 'security' | 'network';
  timestamp: string;
}

export default function LiveLogs() {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (msg: string, type: Log['type']) => {
    const newLog: Log = {
      id: Math.random().toString(36).substr(2, 9),
      msg,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  // Simulation logic for Demo
  useEffect(() => {
    const messages = [
      { m: "Neural Engine: Listening for wake word...", t: 'ai' as const },
      { m: "Intent Engine: Analyzing natural language...", t: 'ai' as const },
      { m: "Route Optimizer: Querying LI.FI for best bridge...", t: 'network' as const },
      { m: "ZK-Vault: Generating biometric proof...", t: 'security' as const },
      { m: "Hook Manager: Injecting JIT liquidity...", t: 'engine' as const },
    ];

    let i = 0;
    const interval = setInterval(() => {
      addLog(messages[i % messages.length].m, messages[i % messages.length].t);
      i++;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-black/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl z-40 hidden md:block">
      <div className="bg-white/5 p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-sonic-cyan" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Live Agent Logs</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="p-4 space-y-3 h-48 overflow-y-auto font-mono text-[9px]">
        {logs.map(log => (
          <div key={log.id} className="flex gap-3 animate-in slide-in-from-right-2 duration-300">
            <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            <div className="flex items-start gap-2">
              {log.type === 'ai' && <Brain size={10} className="mt-0.5 text-purple-400" />}
              {log.type === 'security' && <Shield size={10} className="mt-0.5 text-blue-400" />}
              {log.type === 'network' && <Globe size={10} className="mt-0.5 text-orange-400" />}
              {log.type === 'engine' && <Cpu size={10} className="mt-0.5 text-sonic-cyan" />}

              <span className={
                log.type === 'ai' ? 'text-purple-300' :
                  log.type === 'security' ? 'text-blue-300' :
                    log.type === 'network' ? 'text-orange-300' : 'text-cyan-300'
              }>
                {log.msg}
              </span>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-gray-700 italic">Initializing agent telemetry...</p>
        )}
      </div>

      <div className="bg-sonic-cyan/10 p-2 text-center border-t border-sonic-cyan/20">
        <p className="text-[8px] text-sonic-cyan font-bold tracking-tighter uppercase">Sonic OS v1.0.4 - Telemetry Active</p>
      </div>
    </div>
  );
}
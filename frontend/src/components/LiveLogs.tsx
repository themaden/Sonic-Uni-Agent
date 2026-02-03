import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

export default function LiveLogs({ status }: { status: string }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'idle') {
      setLogs([]);
    } else if (status === 'listening') {
      setLogs([
        { time: new Date().toLocaleTimeString(), text: 'Microphone initialized.', color: 'text-gray-500' },
        { time: new Date().toLocaleTimeString(), text: '> Listening for "Hey Sonic"...', color: 'text-sonic-cyan' },
      ]);
    } else if (status === 'processing') {
      // Step-by-step logs for effect
      setLogs([]); // Clear first

      const steps = [
        { text: '[AI] Analyzing Voice Intent...', color: 'text-sonic-purple', delay: 500 },
        { text: '[NLP] Extracted: Bridge 100 USDC', color: 'text-blue-400', delay: 1500 },
        { text: '[GO] Fetching Best Route...', color: 'text-yellow-400', delay: 2500 },
        { text: '[ZK] Verifying User Identity...', color: 'text-green-400', delay: 3500 },
        { text: '>> Ready for Execution', color: 'text-white', delay: 4500 },
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          setLogs(prev => [...prev, {
            time: new Date().toLocaleTimeString(),
            text: step.text,
            color: step.color
          }]);
        }, step.delay);
      });
    }
  }, [status]);

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

      <div className="space-y-2 h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-gray-600 opacity-50">[{log.time.split(' ')[0]}]</span>
            <span className={log.color}>{log.text}</span>
          </div>
        ))}
        {status === 'processing' && logs.length < 5 && (
          <div className="w-2 h-4 bg-sonic-cyan animate-pulse mt-1"></div>
        )}
      </div>
    </div>
  )
};
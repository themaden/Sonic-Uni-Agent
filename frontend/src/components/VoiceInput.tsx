'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Radio, Power } from 'lucide-react';

interface VoiceInputProps {
  onIntentDetected: (text: string) => void;
  status: 'idle' | 'listening' | 'processing';
  setStatus: (status: 'idle' | 'listening' | 'processing') => void;
}

export default function VoiceInput({ onIntentDetected, status, setStatus }: VoiceInputProps) {
  const [transcript, setTranscript] = useState('');
  const [isSystemActive, setIsSystemActive] = useState(false); // Is system active?

  const recognitionRef = useRef<any>(null);
  const statusRef = useRef(status);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    statusRef.current = status;

    // RE-ACTIVATE MICROPHONE LOOP WHEN BACK TO IDLE
    if (status === 'idle' && isSystemActive && recognitionRef.current) {
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          console.log("🎤 Engine Restarted (Status change to Idle)");
        } catch (e) { /* Already running */ }
      }, 500);
    }
  }, [status, isSystemActive]);

  // 🔊 AUDIO EFFECT
  const playSound = (type: 'wake' | 'success') => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'wake') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      }

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) { }
  };

  // 🗣️ SPEECH
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.includes('en-US'));
      if (enVoice) utterance.voice = enVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🎤 START MICROPHONE ENGINE
  const initSpeechEngine = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("🎤 Engine Running");
    };

    recognition.onresult = (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const currentTranscript = event.results[lastResultIndex][0].transcript;
      const lowerTranscript = currentTranscript.toLowerCase();

      setTranscript(lowerTranscript);

      // --- IMPROVED LOGIC: WAKE WORD & COMMAND IN ONE GO ---
      const wakeWords = ['hey sonic', 'sonic', 'sonik', 'sonıc', 'hey sonik', 'hey sonıc', 'hi sonic', 'ay sonic', 'hey soni'];

      if (statusRef.current === 'idle') {
        const foundWake = wakeWords.some(w => lowerTranscript.includes(w));
        if (foundWake) {
          console.log("🎯 Wake Word Detected:", lowerTranscript);
          playSound('wake');
          setStatus('listening');
          statusRef.current = 'listening'; // Update Ref Immediately!
          speak("Listening.");
        }
      }

      // MODE: COMMAND CAPTURE (Either already listening OR just woken up)
      if (statusRef.current === 'listening') {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);

        // Normalize command by removing wake words
        let command = lowerTranscript;
        wakeWords.forEach(w => {
          command = command.replace(new RegExp(w, 'gi'), '');
        });
        command = command.trim();

        // 🛡️ Filter common background noise/single words
        if (command.length < 2) return;

        console.log("🗣️ Capturing Command:", command);

        // Send after 1.5 seconds of silence
        silenceTimer.current = setTimeout(() => {
          if (command.length > 3) {
            console.log("🚀 Executing Command:", command);
            playSound('success');
            setStatus('processing');
            statusRef.current = 'processing';

            try {
              recognitionRef.current.stop();
              console.log("🎤 Stopping engine for processing...");
            } catch (e) { }

            onIntentDetected(command);
            speak("Processing.");
            setTranscript('');
          }
        }, 1500);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("🎤 Engine Error:", event.error);
      if (event.error === 'network') speak("Network error.");
      if (event.error === 'not-allowed') {
        speak("Microphone access denied.");
        setIsSystemActive(false);
      }
    };

    recognition.onend = () => {
      console.log("🎤 Engine Stopped (onend). Status:", statusRef.current);
      // Only restart if we are NOT processing and system is still supposed to be active
      if (statusRef.current !== 'processing' && isSystemActive) {
        setTimeout(() => {
          try {
            if (recognitionRef.current && isSystemActive) {
              recognitionRef.current.start();
              console.log("🎤 Engine Restarted automatically");
            }
          } catch (e) { }
        }, 500);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsSystemActive(true);
    } catch (e) {
      console.error("🎤 Start Error:", e);
    }
  };

  // 🔘 WHAT HAPPENS ON BUTTON CLICK?
  const handleMicClick = () => {
    // 1. If system is closed -> Open and Start Listening
    if (!isSystemActive) {
      initSpeechEngine();
      setIsSystemActive(true);

      // Should we transition to "Listening Mode" immediately on first click?
      // YES, if user clicked, they likely want to speak.
      playSound('wake');
      setStatus('listening');
      return;
    }

    // 2. If system is already open but waiting -> Force into Listening Mode
    if (status === 'idle') {
      playSound('wake');
      setStatus('listening');
      speak("Listening.");
    }

    // 3. If already listening -> Stop (Cancel)
    if (status === 'listening') {
      setStatus('idle');
      setTranscript('');
    }
  };

  const setIsActive = (val: boolean) => setIsSystemActive(val);

  return (
    <div className="flex flex-col items-center gap-6">

      {/* MAIN MICROPHONE BUTTON (Indicator & Button) */}
      <div
        onClick={handleMicClick}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${!isSystemActive
          ? 'bg-gray-800 border-2 border-gray-600 hover:border-gray-400 opacity-50' // Closed
          : status === 'listening'
            ? 'bg-sonic-cyan/20 border-4 border-sonic-cyan shadow-[0_0_60px_rgba(0,240,255,0.6)] scale-110' // Listening
            : 'bg-gray-900 border-2 border-green-500/50 hover:bg-green-500/10' // Open but Waiting (Waiting for Hey Sonic)
          }`}
      >
        {/* Icons */}
        {!isSystemActive ? (
          <Power className="w-10 h-10 text-gray-400" />
        ) : (
          <Mic className={`w-10 h-10 ${status === 'listening' ? 'text-sonic-cyan' : 'text-green-500'}`} />
        )}

        {/* Animations */}
        {isSystemActive && status === 'listening' && (
          <div className="absolute inset-0 rounded-full border-4 border-sonic-cyan/30 animate-ping"></div>
        )}
      </div>

      {/* FOOTER TEXT / INSTRUCTION */}
      <div className="h-14 text-center flex flex-col items-center justify-center min-w-[300px]">
        {!isSystemActive && (
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">
            Tap to Start
          </p>
        )}

        {isSystemActive && status === 'idle' && (
          <div className="flex flex-col items-center">
            <p className="text-green-500 text-xs font-bold uppercase tracking-widest mb-1">● ONLINE</p>
            <p className="text-gray-400 text-sm">Say "Hey Sonic" or Tap</p>
          </div>
        )}

        {isSystemActive && status === 'listening' && (
          <>
            <p className="text-sonic-cyan text-sm font-bold animate-pulse">Listening...</p>
            <p className="text-white text-lg font-mono mt-1">"{transcript}"</p>
          </>
        )}

        {status === 'processing' && (
          <div className="flex items-center gap-2 text-sonic-purple text-xs uppercase tracking-widest">
            <Radio className="w-4 h-4 animate-spin" />
            Analyzing Intent...
          </div>
        )}
      </div>
    </div>
  );
}
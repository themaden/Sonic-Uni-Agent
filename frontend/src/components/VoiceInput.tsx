'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Radio } from 'lucide-react';

interface VoiceInputProps {
  onIntentDetected: (text: string) => void;
  status: 'idle' | 'listening' | 'processing';
  setStatus: (status: 'idle' | 'listening' | 'processing') => void;
}

export default function VoiceInput({ onIntentDetected, status, setStatus }: VoiceInputProps) {
  const [transcript, setTranscript] = useState('');
  
  // Durumu içeride takip etmek için Ref kullanıyoruz (Takılmayı önler)
  const statusRef = useRef(status);
  const recognitionRef = useRef<any>(null);

  // Status her değiştiğinde Ref'i güncelle
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // 🔊 SES EFEKTİ (BİİP)
  const playWakeSound = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) { console.error(e); }
  };

  // 🗣️ KONUŞAN ASİSTAN
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

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Sürekli dinle
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        // Son söylenen cümleyi al (continuous modda array uzar, sonuncuyu almalıyız)
        const lastResultIndex = event.results.length - 1;
        const currentTranscript = event.results[lastResultIndex][0].transcript;
        const lowerTranscript = currentTranscript.toLowerCase();
        
        setTranscript(currentTranscript);

        // 🚨 1. AŞAMA: WAKE WORD ("Hey Sonic")
        if (statusRef.current === 'idle' && (lowerTranscript.includes('hey sonic') || lowerTranscript.includes('sonic'))) {
          playWakeSound(); 
          setStatus('listening');
          speak("I'm listening.");
        }

        // 🚨 2. AŞAMA: KOMUT ALMA
        if (statusRef.current === 'listening') {
          // "Hey Sonic" kelimelerini temizle
          const command = currentTranscript.replace(/hey sonic|sonic/gi, '').trim();
          
          // Komut yeterince uzunsa ve cümle bittiyse (isFinal)
          if (command.length > 5 && event.results[lastResultIndex].isFinal) {
             playWakeSound();
             setStatus('processing'); // Durumu güncelle
             recognition.stop();      // Dinlemeyi durdur
             onIntentDetected(command); // Backend'e gönder
             speak("On it.");
             setTranscript('');
          }
        }
      };

      // Eğer durursa tekrar başlat (Siri gibi hep açık kalsın)
      recognition.onend = () => {
        if (statusRef.current !== 'processing') {
            try { recognition.start(); } catch(e) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []); // <-- DİKKAT: Dependency array boş [], yani sadece bir kere başlar ve kapanmaz.

  return (
    <div className="flex flex-col items-center gap-4">
      {/* MİKROFON GÖRSELİ */}
      <div 
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          status === 'listening' 
            ? 'bg-sonic-cyan/20 shadow-[0_0_50px_rgba(0,240,255,0.4)] scale-110 border-2 border-sonic-cyan' 
            : 'bg-gray-900 border border-gray-800'
        }`}
      >
        <Mic className={`w-10 h-10 ${status === 'listening' ? 'text-sonic-cyan' : 'text-gray-500'}`} />
        {status === 'listening' && (
           <div className="absolute inset-0 rounded-full border-4 border-sonic-cyan/30 animate-ping"></div>
        )}
      </div>

      {/* DURUM YAZISI */}
      <div className="h-8 text-center">
        {status === 'idle' && (
          <p className="text-gray-500 text-xs tracking-widest uppercase animate-pulse">Say "Hey Sonic"</p>
        )}
        {status === 'listening' && (
          <p className="text-sonic-cyan text-sm font-mono font-bold">"{transcript || "Listening..."}"</p>
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
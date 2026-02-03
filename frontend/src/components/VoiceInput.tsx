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
  const [isSystemActive, setIsSystemActive] = useState(false); // Sistem açık mı?

  const recognitionRef = useRef<any>(null);
  const statusRef = useRef(status);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // 🔊 SES EFEKTİ
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

  // 🗣️ KONUŞMA
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

  // 🎤 MİKROFON MOTORU BAŞLAT
  const initSpeechEngine = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("🎤 Motor Çalışıyor");
    };

    recognition.onresult = (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const currentTranscript = event.results[lastResultIndex][0].transcript;
      const lowerTranscript = currentTranscript.toLowerCase();

      setTranscript(lowerTranscript);

      // MOD 1: "HEY SONIC" İLE UYANMA
      // Sadece 'idle' modundaysak ve 'hey sonic' duyarsak
      if (statusRef.current === 'idle' && (
        lowerTranscript.includes('hey sonic') ||
        lowerTranscript.includes('sonic') ||
        lowerTranscript.includes('sonik') ||
        lowerTranscript.includes('sonıc') // Turkish accent support
      )) {
        playSound('wake');
        setStatus('listening');
        speak("Listening.");
      }

      // MOD 2: KOMUT ALMA
      // 'listening' modundaysak (ya elle ya sesle açıldıysa)
      if (statusRef.current === 'listening') {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);

        const command = currentTranscript.replace(/hey sonic|sonic|sonik|sonıc/gi, '').trim();

        // Sustuktan 1.5 saniye sonra gönder
        silenceTimer.current = setTimeout(() => {
          if (command.length > 5) {
            playSound('success');
            setStatus('processing');
            recognition.stop();
            onIntentDetected(command);
            speak("On it.");
            setTranscript('');
          }
        }, 1500);
      }
    };

    recognition.onend = () => {
      // Eğer işlem yapmıyorsak motoru hep açık tut (Sürekli Dinle)
      if (statusRef.current !== 'processing') {
        try { recognition.start(); } catch (e) { }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsActive(true);
  };

  // 🔘 BUTONA TIKLANINCA NE OLSUN?
  const handleMicClick = () => {
    // 1. Eğer sistem kapalıysa -> Aç ve Dinlemeye Başla
    if (!isSystemActive) {
      initSpeechEngine();
      setIsSystemActive(true);

      // İlk tıklamada hemen "Dinleme Moduna" geçelim mi?
      // EVET, kullanıcı tıkladıysa konuşmak istiyordur.
      playSound('wake');
      setStatus('listening');
      return;
    }

    // 2. Eğer sistem zaten açıksa ama bekliyorsa -> Zorla Dinleme Moduna Sok
    if (status === 'idle') {
      playSound('wake');
      setStatus('listening');
      speak("Listening.");
    }

    // 3. Eğer zaten dinliyorsa -> Durdur (İptal et gibi)
    if (status === 'listening') {
      setStatus('idle');
      setTranscript('');
    }
  };

  const setIsActive = (val: boolean) => setIsSystemActive(val);

  return (
    <div className="flex flex-col items-center gap-6">

      {/* ANA MİKROFON BUTONU (Hem Gösterge Hem Buton) */}
      <div
        onClick={handleMicClick}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${!isSystemActive
            ? 'bg-gray-800 border-2 border-gray-600 hover:border-gray-400 opacity-50' // Kapalı
            : status === 'listening'
              ? 'bg-sonic-cyan/20 border-4 border-sonic-cyan shadow-[0_0_60px_rgba(0,240,255,0.6)] scale-110' // Dinliyor
              : 'bg-gray-900 border-2 border-green-500/50 hover:bg-green-500/10' // Açık ama Bekliyor (Hey Sonic Bekliyor)
          }`}
      >
        {/* İkonlar */}
        {!isSystemActive ? (
          <Power className="w-10 h-10 text-gray-400" />
        ) : (
          <Mic className={`w-10 h-10 ${status === 'listening' ? 'text-sonic-cyan' : 'text-green-500'}`} />
        )}

        {/* Animasyonlar */}
        {isSystemActive && status === 'listening' && (
          <div className="absolute inset-0 rounded-full border-4 border-sonic-cyan/30 animate-ping"></div>
        )}
      </div>

      {/* ALT METİN / TALİMAT */}
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
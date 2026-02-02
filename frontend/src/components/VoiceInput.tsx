'use client';

import { useState, useEffect } from "react";
import {Mic,Square, Loader2, ArrowRight} from "lucide-react";
import axios from "axios";


declare global {
     interface Window {
        
         webkitSpeechRecognition: any; // Function to run when response comes from the backend

     }
}

interface VoiceInputProps {
     
    onIntentReady: (data: any) => void;
}

export default function VoiceInput ({ onIntentReady }: VoiceInputProps) {
     
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
   const [loading, setLoading] = useState(false);
   const [recognition, setRecognition] = useState<any>(null);



   useEffect(() => {
    if (typeof window !== 'undefined' && window.webkitSpeechRecognition) {
      const r = new window.webkitSpeechRecognition();
      r.continuous = false;
      r.interimResults = true;
      r.lang = 'en-US'; // Demo için İngilizce

      r.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      r.onend = () => {
        setIsListening(false);
      };

      setRecognition(r);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return alert('Browser not supported! Use Chrome.');

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleAnalyze = async () => {
    if (!transcript) return;
    setLoading(true);
    
    try {
      // 1. Send to the backend (The Go API we wrote yesterday)
      // NOTE: The backend may not be running on the 8080 yet, we can simulate that. 
      // For now, let's try the actual connection:
      const response = await axios.post('http://localhost:8080/api/v1/chat', {
        text: transcript
      });
      
      console.log("Backend Cevabı:", response.data);
      onIntentReady(response.data.data); // Send data to the homepage.
    } catch (error) {
      console.error("Backend Hatası:", error);
      alert("Backend bağlantısı yok! Simülasyon moduna geçiliyor...");
      
      // FALLBACK (A fake response to prevent the demo from breaking if the backend is down)
      onIntentReady({
        action: "CROSS_CHAIN_SWAP",
        source_chain: "Sui",
        target_chain: "Ethereum",
        token_in: "USDC",
        token_out: "ETH",
        amount: 100
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-8 w-full max-w-xl mx-auto">
      
      {/* 1.  Speaking Area */}
      <div className={`relative w-full p-6 rounded-2xl border transition-all duration-300 ${isListening ? 'border-red-500 bg-red-900/10 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-gray-800 bg-gray-900/50'}`}>
        
        <p className="text-2xl text-center font-medium text-gray-200 min-h-[40px]">
          {transcript || (isListening ? "Listening..." : "Tap microphone & speak...")}
        </p>

        {/* Wave Animation (Only appears while listening) */}
        {isListening && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 h-4 items-end">
                <span className="w-1 bg-red-500 animate-[bounce_1s_infinite] h-2"></span>
                <span className="w-1 bg-red-500 animate-[bounce_1.2s_infinite] h-4"></span>
                <span className="w-1 bg-red-500 animate-[bounce_0.8s_infinite] h-3"></span>
            </div>
        )}
      </div>

      {/* 2. Control Buttons */}
      <div className="flex gap-4">
        {/* Microphone Button */}
        <button 
            onClick={toggleListening}
            className={`p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            {isListening ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
        </button>

        {/*Submit Button (Appears only if there is text) */}
        {transcript && !isListening && (
            <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 rounded-full font-bold text-lg transition-all"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>Analyze <ArrowRight /></>}
            </button>
        )}
      </div>

    </div>
  );
}  


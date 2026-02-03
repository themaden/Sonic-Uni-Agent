'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import VoiceInput from '@/src/components/VoiceInput';
import TransactionModal from '@/src/components/TransactionModal';
import LiveLogs from '@/src/components/LiveLogs';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Radio, AlertCircle } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const [intent, setIntent] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // WAGMI Hooks (Metamask İşlemleri İçin)
  const { data: hash, sendTransaction } = useSendTransaction();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // 🧠 BEYİN FONKSİYONU: Sesi Backend'e Gönderir
  const handleVoiceIntent = async (text: string) => {
    console.log("🚀 Backend'e Gönderiliyor:", text);
    setErrorMsg('');
    setStatus('processing');

    try {
      // 1. Go Sunucusuna İstek At
      const response = await fetch('http://localhost:8080/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, address: "0x123..." }) // Kullanıcı adresi
      });

      // 2. Cevabı Kontrol Et
      if (!response.ok) {
        throw new Error(`Sunucu Hatası: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Backend Cevabı:", data);

      // 3. Modalı Açmak için Veriyi Hazırla
      // Backend'den gelen veri yapısına göre burayı eşliyoruz
      setIntent({
        action: 'BRIDGE ASSETS', // Varsayılan başlık
        source_chain: 'SEPOLIA',
        target_chain: 'SUI NET',
        amount: text.match(/\d+/)?.[0] || '100', // Metinden sayıyı bulamazsa 100 koy
        token_in: 'USDC',
        original_text: text,
        // Backend'den gelen gerçek rota verileri varsa buraya eklenebilir
        ...data 
      });

      setStatus('idle'); // İşlem bitti, modal açılsın

    } catch (err: any) {
      console.error("❌ Hata:", err);
      setErrorMsg("Backend'e ulaşılamadı! Go sunucusu çalışıyor mu?");
      setStatus('idle');
    }
  };

  const handleExecute = async () => {
    // Demo Transaction: Metamask'ı tetikler
    // Gerçekte 'intent' içindeki verilere göre işlem yapılır
    if (!intent) return;
    
    try {
        sendTransaction({
          to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Demo Alıcı
          value: parseEther('0.0001'), 
        });
        setIntent(null); // Modalı kapat
    } catch (e) {
        console.error("İşlem İptal:", e);
    }
  };

  return (
    <main className="min-h-screen bg-sonic-dark text-white relative overflow-hidden selection:bg-sonic-cyan selection:text-black">
      
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 bg-[size:40px_40px] bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-cyber-gradient pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-sonic-cyan/10 rounded border border-sonic-cyan/20">
              <Radio className="text-sonic-cyan animate-pulse" size={20} />
           </div>
           <div>
              <h1 className="font-bold tracking-[0.2em] text-lg text-white">SONIC_UNI_AGENT</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Premium Voice Interface</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-sonic-cyan">
                <span className="w-2 h-2 bg-sonic-cyan rounded-full animate-ping"></span>
                SYSTEM ONLINE
            </div>
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </header>

      {/* Ana İçerik */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative z-10">
        
        {/* Hata Mesajı Göstergesi */}
        {errorMsg && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded flex items-center gap-3 text-red-200 animate-pulse">
                <AlertCircle />
                <span>{errorMsg}</span>
            </div>
        )}

        {isConnected ? (
          <>
            {/* Dinleme Durumu */}
            <div className="mb-8">
               {status === 'listening' ? (
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono tracking-widest uppercase">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Listening Mode Active
                   </div>
               ) : status === 'processing' ? (
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-400 text-xs font-mono tracking-widest uppercase">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-spin"></div>
                      Processing with AI & ZK...
                   </div>
               ) : (
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-mono tracking-widest uppercase">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      System Ready
                   </div>
               )}
            </div>

            {/* MİKROFON MERKEZİ */}
            {!intent && (
                <VoiceInput 
                    onIntentDetected={handleVoiceIntent} 
                    status={status} 
                    setStatus={setStatus} 
                />
            )}

            {/* MODAL (Onay Ekranı) - Veri gelince açılır */}
            {intent && (
                <TransactionModal 
                    intent={intent}
                    onConfirm={handleExecute}
                    onCancel={() => setIntent(null)}
                />
            )}

            {/* SAĞ ALT LOG KUTUSU */}
            <LiveLogs status={status} />

          </>
        ) : (
          <div className="text-center space-y-6">
             <div className="w-20 h-20 mx-auto bg-gray-900 rounded-full flex items-center justify-center border border-gray-800 animate-pulse">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
             </div>
             <p className="text-gray-500 tracking-widest uppercase text-sm">Waiting for Neural Link (Connect Wallet)...</p>
          </div>
        )}

      </div>
    </main>
  );
}
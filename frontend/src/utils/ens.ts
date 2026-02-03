//front end/src/utils/ens.ts

// frontend/src/utils/ens.ts
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

// Ethereum Ana Ağına Bağlan (ENS oradadır)
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function resolveENSProfile(ensName: string) {
  // Basit doğrulama: .eth ile bitmiyorsa uğraşma
  if (!ensName || !ensName.toLowerCase().endsWith('.eth')) return null;

  try {
    const normalizedName = normalize(ensName);
    
    // 1. Adresi Bul (0x...)
    const address = await client.getEnsAddress({ name: normalizedName });
    
    if (!address) return null;

    // 2. Avatarı (Profil Resmini) Bul
    const avatar = await client.getEnsAvatar({ name: normalizedName });

    return {
      name: ensName,
      address,
      avatar: avatar || null, // Avatar yoksa null dön
    };
  } catch (e) {
    console.error("ENS Çözümleme Hatası:", e);
    return null;
  }
}
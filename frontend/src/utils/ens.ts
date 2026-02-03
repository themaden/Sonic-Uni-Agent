// frontend/src/utils/ens.ts
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

// Connect to Ethereum Mainnet (where ENS lives)
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function resolveENSProfile(ensName: string) {
  // Simple validation: don't bother if it doesn't end with .eth
  if (!ensName || !ensName.toLowerCase().endsWith('.eth')) return null;

  try {
    const normalizedName = normalize(ensName);

    // 1. Find the address (0x...)
    const address = await client.getEnsAddress({ name: normalizedName });

    if (!address) return null;

    // 2. Find the Avatar (Profile Picture)
    const avatar = await client.getEnsAvatar({ name: normalizedName });

    return {
      name: ensName,
      address,
      avatar: avatar || null, // Return null if no avatar
    };
  } catch (e) {
    console.error("ENS Resolution Error:", e);
    return null;
  }
}
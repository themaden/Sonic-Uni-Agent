import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: 'Sonic Uni-Agent',
  projectId: 'YOUR_PROJECT_ID', // Replace with a valid WalletConnect Project ID for production
  chains: [sepolia],
  ssr: true,
});

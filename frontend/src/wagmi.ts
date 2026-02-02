import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
     appName: 'Sonic Uni-Agent',
    projectId: 'YOUR_PROJECT_ID', // Normalde WalletConnect'ten alınır, localde boş geçebilirsin
  chains: [sepolia], // Biz sadece Sepolia kullanacağız
  ssr: true, // Server Side Rendering desteği

})

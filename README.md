# 🎙️ Sonic Uni-Agent 🌀🛡️

![Banner](https://img.shields.io/badge/Status-Hackathon_Ready-success?style=for-the-badge) ![Stack](https://img.shields.io/badge/Tech-Go_|_Next.js_|_Move_|_Solidity-blue?style=for-the-badge)

**Sonic Uni-Agent** is an AI-powered, voice-controlled DeFi orchestrator designed for **HackMoney 2026**. It enables users to execute complex cross-chain strategies using natural language, leveraging **Uniswap v4 Hooks** for Just-In-Time (JIT) liquidity and **Circle CCTP** for seamless asset transfer.

> *"DeFi at the Speed of Sound"*

## 🚀 Key Features

- **🗣️ Voice-to-Intent:** AI-driven parsing of natural language commands into on-chain actions. (e.g., *"Bridge 100 USDC to Sui"*).
- **🦄 Uniswap v4 Hooks:** Custom `beforeSwap` hooks for JIT liquidity injection and dynamic fee management.
- **⭕ Cross-Chain Bridge:** Burn-and-mint mechanism utilizing **Yellow Network Solver** logic and **Circle CCTP** for seamless transfers (Sui <-> Ethereum).
- **🆔 ENS Identity Verification:** Real-time visual confirmation of recipients using Ethereum Name Service (prevents phishing).
- **🛡️ Privacy-First:** Powered by **Noir (ZK-proofs)** to verify voice authenticity without exposing biometrics.
- **⚡ High-Speed Backend:** Orchestrated via a high-performance **Golang (Fiber)** server.

## 🏆 Hackathon Tracks & Integrations

We have architected a solution that integrates key ecosystem partners:

| Partner | Integration Details |
| :--- | :--- |
| **Yellow Network** | Implemented custom **Clearing House Solver** logic in Go for optimal liquidity routing. |
| **SUI Network** | **Move-based Gateway Module** to bridge assets from EVM chains seamlessly. |
| **Uniswap Foundation** | **v4 Hooks** for programmatic swap execution and security checks. |
| **ENS** | **Visual Identity Resolution** to display user avatars during voice transaction confirmation. |

## 🏗 Architecture Overview

The project follows a **Modular Monolith** architecture to ensure scalability:

| Component | Stack | Responsibility |
|-----------|-------|----------------|
| **Backend** | Golang, Fiber | Orchestration, Intent Parsing, SDK Integrations |
| **Contracts** | Solidity (Foundry) | Uniswap v4 Hooks, Settlement Logic |
| **L1 Logic** | Move (Sui) | Triggering CCTP transfers from Sui |
| **Circuits** | Noir | Zero-Knowledge proofs for biometric/voice auth |
| **Frontend** | Next.js, Tailwind | Cyberpunk UI, Voice Processing, Wallet Connection |

## 🛠️ Getting Started

### Prerequisites
- **Go** 1.21+
- **Node.js** 18+
- **Foundry** (Forge)
- **Sui CLI**
- **Metamask** Wallet

### 1. Installation


2. Run Backend (The Brain)Bashcd backend-go
go mod tidy
go run cmd/api/main.go
# Server starts at :8080
3. Run Frontend (The Interface)Bashcd frontend
npm install
npm run dev
# Open http://localhost:3000
🚧 Development Status (HackMoney Sprint)ModuleStatusDescriptionSmart Contracts (ETH)✅ CompletedUniswap v4 Hook skeleton & interface setup.Smart Contracts (Sui)✅ CompletedMove gateway for intent emission & burning.Backend (Go)✅ CompletedFiber Server, AI Intent Engine & Yellow Solver Logic.ZK Circuits (Noir)✅ CompletedVoice authentication circuits.Frontend✅ CompletedVoice UI, ENS Resolution, Transaction Modal.🧪 Running TestsSui Contracts:Bashcd contracts-sui
sui move test
Go Backend:Bashcd backend-go
go test ./...
🛡️ Zero-Knowledge Security (Noir)To ensure the integrity of voice commands, we integrated a Noir ZK-circuit. This prevents "Voice Spoofing" by verifying that the biometric signature matches the user's private key without exposing sensitive data to the backend.Circuit Path: circuits-noir/sonic_auth_circuitConstraint: Pedersen Hash verification of biometric salt.🧠 Brain Logic (AI Engine)The orchestrator uses advanced LLMs to parse natural language intents.Input: "Send 1 ETH to vitalik.eth"Process: Resolves ENS -> Fetches Avatar -> Prepares Transaction.Output: Structured JSON for immediate execution.Built with ❤️ for HackMoney 2026

```bash
# Clone the repository
git clone [https://github.com/YOUR-USERNAME/sonic-uni-agent.git](https://github.com/YOUR-USERNAME/sonic-uni-agent.git)
cd sonic-uni-agent
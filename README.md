# Sonic Uni-Agent 🎙️🌀🛡️

**Sonic Uni-Agent** is an AI-powered, voice-controlled DeFi orchestrator designed for **HackMoney 2026**. It enables users to execute complex cross-chain strategies using natural language, leveraging **Uniswap v4 Hooks** for Just-In-Time (JIT) liquidity and **Circle CCTP** for seamless asset transfer.

## 🚀 Key Features

- **🗣️ Voice-to-Intent:** AI-driven parsing of natural language commands into on-chain actions.
- **🦄 Uniswap v4 Hooks:** Custom hooks for JIT liquidity injection and dynamic fee management.
- **⭕ Circle CCTP Integration:** Burn-and-mint mechanism for secure cross-chain USDC bridging (Sui <-> Ethereum).
- **🛡️ Privacy-First:** Powered by **Noir (ZK-proofs)** to verify voice authenticity and prevent deepfake attacks.
- **⚡ High-Speed Execution:** Orchestrated via a high-performance **Golang** backend.

## 🏗 Architecture Overview

The project follows a **Modular Monolith** architecture to ensure scalability and separation of concerns:

| Component | Stack | Responsibility |
|-----------|-------|----------------|
| **Backend** | Golang, Fiber | Orchestration, Intent Parsing, SDK Integrations |
| **Contracts** | Solidity (Foundry) | Uniswap v4 Hooks, Settlement Logic |
| **L1 Logic** | Move (Sui) | Triggering CCTP transfers from Sui |
| **Circuits** | Noir | Zero-Knowledge proofs for biometric/voice auth |
| **Frontend** | Next.js, Tailwind | User Interface and Wallet Connection |

## 🛠️ Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- Foundry (Forge)
- Nargo (Noir)

*(Instructions for running the project will be added as modules are developed)*

---
*Built with ❤️ for HackMoney 2026*
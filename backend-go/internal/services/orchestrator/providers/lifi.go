package providers

import (
	"fmt"
)

type LiFiProvider struct {
	BaseURL string
}

// Removed duplicate GetBestQuote method with different parameters to resolve redeclaration error.

func NewLiFiProvider() *LiFiProvider {
	return &LiFiProvider{BaseURL: "https://li.quest/v1"}
}

// GetBestQuote finds the most efficient swap route across bridges/DEXs.
func (l *LiFiProvider) GetBestQuote(tokenIn, tokenOut string, amount float64) (string, float64) {
	fmt.Printf("🦎 [LI.FI] Searching best route for %s -> %s...\n", tokenIn, tokenOut)

	// Mock Logic: Always return Uniswap v4 as the best route for this hackathon
	route := "Uniswap v4 via JIT Hook"
	estimatedGas := 0.002 // ETH

	fmt.Printf("🦎 [LI.FI] Optimization Complete. Best Route: %s (Gas: %.4f ETH)\n", route, estimatedGas)
	return route, estimatedGas
}

package orchestrator

import ( 
	"strings"
	"errors"
)

// SENIOR NOTE: This struct represents the "Intent" extracted from the user's voice.
// We use structured tagging for JSON serialization.

type UserIntent struct {
	 
	 Action string `json:"action"` // Example: "Swap", "BRINGE"
	 SourceChain string  `json:"source_chain"` // Example "Sui"
	 TargetChain string  `json:"target_chain"` // Example "Ethereum"
	 TokenIn string `json:"token_in"`     // Example: "USDC"
	 TokenOut string `json:"token_out"`    // Example: "ETH"
	 Amount float64 `json:"amount"`       // 
	 Confidence float64 `json:"confidence_score"` // AI Score
	 
}

type AIService struct {
	 // Future: AI
}

func NewAIService() *AIService {
	return &AIService{}
}

// ParseCommand simulates an NLP engine processing natural language.
// In the final version, this will call the AI API.
// For the Hackathon MVP, we use keyword matching to demonstrate the flow.

func (s *AIService) ParseCommand(text string) (*UserIntent, error) {
	  
	 
	 text = strings.ToLower(text)

	if strings.Contains(text, "sui") && strings.Contains(text, "ethereum") {
		return &UserIntent{
			Action:      "CROSS_CHAIN_SWAP",
			SourceChain: "Sui",
			TargetChain: "Ethereum",
			TokenIn:     "USDC",
			TokenOut:    "ETH", //  Score
			Amount:      100.0, // Example fixed amount
			Confidence:  0.98,
		}, nil
	}

	// Wrong AI anlayamazsa:
	return nil, errors.New("AI could not extract intent from voice command")
}
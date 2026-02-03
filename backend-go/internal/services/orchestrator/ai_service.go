package orchestrator

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	openai "github.com/sashabaranov/go-openai"
)

// UserIntent: Structure representing the user's parsed command
type UserIntent struct {
	Action      string  `json:"action"`       // e.g: SWAP, BRIDGE
	SourceChain string  `json:"source_chain"` // e.g: Sui
	TargetChain string  `json:"target_chain"` // e.g: Ethereum
	TokenIn     string  `json:"token_in"`     // e.g: USDC
	TokenOut    string  `json:"token_out"`    // e.g: ETH
	Amount      float64 `json:"amount"`
}

type AIService struct {
	client *openai.Client
}

func NewAIService() *AIService {
	apiKey := os.Getenv("OPENAI_API_KEY")

    
	//
	config := openai.DefaultConfig(apiKey)
	config.BaseURL = "https://api.deepseek.com/v1" // DeepSeek API Address
	
	return &AIService{
		client: openai.NewClientWithConfig(config),
	}
}

// ParseCommand: Takes text, queries AI, returns JSON.
func (s *AIService) ParseCommand(text string) (*UserIntent, error) {
	fmt.Printf("🤖 [AI] Analyzing: %s\n", text)

	// Teach AI its role (Prompt Engineering)
	systemPrompt := `
	You are a DeFi Intent Parser for Sonic Agent.
	Extract the intent from the user's voice command into JSON.
	
	Rules:
	1. Supported Chains: Sui, Ethereum, Sepolia, Optimism, Base.
	2. Supported Tokens: USDC, ETH, SUI, WBTC.
	3. Default Amount: If not specified, use 0.
	
	Example Input: "Move 100 USDC from Sui to Sepolia"
	Example Output: {"action": "BRIDGE", "source_chain": "Sui", "target_chain": "Sepolia", "token_in": "USDC", "token_out": "USDC", "amount": 100}

	ONLY return the JSON. No explanation.`

	resp, err := s.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "deepseek-chat", // Use this instead of GPT-4
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleSystem, Content: systemPrompt},
				{Role: openai.ChatMessageRoleUser, Content: text},
			},
		},
	)

	if err != nil {
		fmt.Printf("❌ OpenAI Error: %v\n", err)
		return nil, err
	}

	// Clean the response
	content := resp.Choices[0].Message.Content
	// Sometimes AI returns with ```json ... ``` tags, let's clean those
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimPrefix(content, "```")
	content = strings.TrimSuffix(content, "```")

	fmt.Printf("🤖 [AI] Response: %s\n", content)

	var intent UserIntent
	if err := json.Unmarshal([]byte(content), &intent); err != nil {
		return nil, err
	}

	return &intent, nil
}
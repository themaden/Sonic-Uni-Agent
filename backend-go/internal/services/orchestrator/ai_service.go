package orchestrator

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type AIService struct {
	apiKey string
	client *http.Client
}

func NewAIService() *AIService {
	return &AIService{
		apiKey: os.Getenv("DEEPSEEK_API_KEY"),
		client: &http.Client{},
	}
}

// DeepSeek/OpenAI İstek Modelleri
type OpenAIChatRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	// DİKKAT: `omitempty` kaldırdık! Boş olsa bile "content": "" olarak gitmeli.
	Content string `json:"content"` 
}

type UserIntent struct {
	Action      string  `json:"action"`
	SourceChain string  `json:"source_chain"`
	TargetChain string  `json:"target_chain"`
	TokenIn     string  `json:"token_in"`
	TokenOut    string  `json:"token_out"`
	Amount      float64 `json:"amount"` 
}

func (s *AIService) ParseCommand(text string) (*UserIntent, error) {
	// Call the new map-based method
	resultMap, err := s.AnalyzeIntent(text)
	if err != nil {
		return nil, err
	}

	// Helper to extract string safely
	getString := func(key string) string {
		if v, ok := resultMap[key].(string); ok {
			return v
		}
		return ""
	}

    // Helper to extract float safely (handling string numbers too)
    getFloat := func(key string) float64 {
        if v, ok := resultMap[key].(float64); ok {
            return v
        }
        if v, ok := resultMap[key].(string); ok {
            var f float64
            fmt.Sscanf(v, "%f", &f)
            return f
        }
        return 0
    }

	// Map back to struct for internal service compatibility
	return &UserIntent{
		Action:      getString("action"),
		SourceChain: getString("source_chain"),
		TargetChain: getString("target_chain"),
		TokenIn:     getString("token_in"),
		TokenOut:    getString("token_in"), // Usually same for simple bridge/swap unless specified
		Amount:      getFloat("amount"),
	}, nil
}

type OpenAIResponse struct {
	Choices []struct {
		Message Message `json:"message"`
	} `json:"choices"`
}

func (s *AIService) AnalyzeIntent(userPrompt string) (map[string]interface{}, error) {
	
	// 🛡️ 1. KORUMA KALKANI: BOŞ MESAJ KONTROLÜ
	// Eğer kullanıcı hiçbir şey demediyse veya boşluk gönderdiyse işlem yapma.
	if len(strings.TrimSpace(userPrompt)) < 2 {
		fmt.Println("⚠️ Uyarı: Boş mesaj geldi, AI çağrısı iptal edildi.")
		// Varsayılan boş bir JSON dönelim ki frontend patlamasın
		return map[string]interface{}{
			"error": "Lütfen bir komut söyleyin.",
		}, nil
	}

	// DeepSeek Sistem Mesajı (Prompt Engineering)
	systemPrompt := `
	You are Sonic Uni-Agent, a DeFi voice assistant.
	Analyze the user's intent and return a JSON object.
	
	Supported Chains: "SEPOLIA", "SUI NET", "ETHEREUM".
	Supported Tokens: "USDC", "ETH", "SUI".
	
	Example Input: "Bridge 100 USDC to Sui"
	Example Output JSON:
	{
		"action": "BRIDGE ASSETS",
		"source_chain": "SEPOLIA",
		"target_chain": "SUI NET",
		"amount": "100",
		"token_in": "USDC",
		"original_text": "Bridge 100 USDC to Sui"
	}

	If the input is irrelevant, return {"action": "UNKNOWN"}.
	Return ONLY JSON. No markdown.
	`

	requestBody := OpenAIChatRequest{
		Model: "deepseek-chat", // Veya "gpt-3.5-turbo"
		Messages: []Message{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
	}

	jsonData, _ := json.Marshal(requestBody)

	req, err := http.NewRequest("POST", "https://api.deepseek.com/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	fmt.Printf("🤖 [AI] Analyzing: %s\n", userPrompt)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Yanıtı Oku
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		fmt.Printf("❌ OpenAI Error: %s\n", string(body))
		return nil, fmt.Errorf("AI Provider Error: %d", resp.StatusCode)
	}

	var aiResponse OpenAIResponse
	if err := json.Unmarshal(body, &aiResponse); err != nil {
		return nil, err
	}

	if len(aiResponse.Choices) == 0 {
		return nil, fmt.Errorf("AI boş yanıt döndü")
	}

	// Gelen string JSON'ı map'e çevir (Frontend'in anlaması için)
	rawContent := aiResponse.Choices[0].Message.Content
	
	// Markdown temizliği (Bazen ```json ... ``` şeklinde döner)
	rawContent = strings.TrimPrefix(rawContent, "```json")
	rawContent = strings.TrimSuffix(rawContent, "```")
	rawContent = strings.TrimSpace(rawContent)

	var result map[string]interface{}
	if err := json.Unmarshal([]byte(rawContent), &result); err != nil {
		fmt.Println("⚠️ AI JSON döndürmedi, düz metin geldi:", rawContent)
		// Fallback (Yedek) Yanıt
		return map[string]interface{}{
			"action": "UNKNOWN",
			"original_text": userPrompt,
		}, nil
	}

	return result, nil
}
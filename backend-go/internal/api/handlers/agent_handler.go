package handlers

import (
	 
	 "github.com/gofiber/fiber/v2"
	 "github.com/maden/sonic-uni-agent/internal/services/orchestrator"
)

type AgentHandler struct {

	 aiService *orchestrator.AIService
	 executionService *orchestrator.ExecutionService
}

//Constructor for AgentHandler

func NewAgentHandler() *AgentHandler {
	return &AgentHandler{
		aiService: orchestrator.NewAIService(),
		executionService: orchestrator.NewExecutionService(),
	}
}

// HandleVoiceCommand handles the POST /api/v1/chat request

func (h *AgentHandler) HandleVoiceCommand(c *fiber.Ctx) error {
	 
	 // 1. Retrieve data from the user (JSON body)
	 type Request struct {
		 Text string `json:"text"`
	 }
	 
	 var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}
	
	// 2. Send to AI Service (Parsing)

	intent, err := h.aiService.ParseCommand(req.Text)
	if err != nil {
		return c.Status(422).JSON(fiber.Map{
			"error": "Could not understand command. Try saying: 'Move USDC from Sui to Ethereum'",
		})
	}

	// 3. Respond with extracted intent
	result := h.executionService.ExecuteIntent(intent)

	// 4. Response
	return c.JSON(fiber.Map{
		"status": "success",
		"intent": intent,  // 
		"result": result,  // 
	})
}
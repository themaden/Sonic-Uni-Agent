package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/maden/sonic-uni-agent/internal/config"
	"github.com/maden/sonic-uni-agent/internal/api/handlers"
)

// SENIOR NOTE: This is the entry point of the application.
// We initialize the Fiber app, load configs, and register middlewares here.
// SENIOR NOTE: This is the entry point of the application.
// We initialize the Fiber app, load configs, and register middlewares here.
func main() {
	// 1. Load Configuration
	cfg := config.LoadConfig()

	// 2. Initialize Fiber App (High performance web framework)
	app := fiber.New(fiber.Config{AppName: cfg.Appname})
	app.Use(logger.New()) 
	app.Use(cors.New())   

	// 3. Register Routes and Handlers
	agentHandler := handlers.NewAgentHandler()

	// 4. API Route for Voice Commands
	api := app.Group("/api/v1")

	// 4. Health Check Route 
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "active",
			"message": "Sonic Uni-Agent Orchestrator is ready 🎙️",
			"uptime":  "100%",
		})
	})
	api.Post("/chat", agentHandler.HandleVoiceCommand)

	// 5. Start Server
	log.Printf("🚀 Server starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
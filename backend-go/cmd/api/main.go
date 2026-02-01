package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/maden/sonic-uni-agent/internal/config"
)

// SENIOR NOTE: This is the entry point of the application.
// We initialize the Fiber app, load configs, and register middlewares here.
// SENIOR NOTE: This is the entry point of the application.
// We initialize the Fiber app, load configs, and register middlewares here.
func main() {
	// 1. Load Configuration
	cfg := config.LoadConfig()

	// 2. Initialize Fiber App (High performance web framework)
	app := fiber.New(fiber.Config{
		AppName: cfg.Appname,
	})

	// 3. Middlewares 
	app.Use(logger.New()) 
	app.Use(cors.New())   

	// 4. Health Check Route 
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "active",
			"message": "Sonic Uni-Agent Orchestrator is ready 🎙️",
			"uptime":  "100%",
		})
	})

	// 5. Start Server
	log.Printf("🚀 Server starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
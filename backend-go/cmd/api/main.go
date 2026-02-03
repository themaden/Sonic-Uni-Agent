package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	
	"github.com/maden/sonic-uni-agent/internal/services/orchestrator"
)


// SENIOR NOTE: This is the entry point of the application.
// We initialize the Fiber app, load configs, and register middlewares here.
// SENIOR NOTE: This is the entry point of the application.
// We initialize the Fiber app, load configs, and register middlewares here.
func main() {
	// 1. Load .env File
	if err := godotenv.Load(); err != nil {
		fmt.Println("⚠️ .env not found, using system variables.")
	}

	// 2. Initialize Fiber App
	app := fiber.New()

	// 3. Middleware'ler
	app.Use(logger.New()) // For viewing logs

	// 🚨 CRITICAL SETTING: CORS (Allow Frontend)
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", // Only allow our Frontend
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// 4. Start Services
	aiService := orchestrator.NewAIService()
	execService := orchestrator.NewExecutionService()

	// 5. Routes
	api := app.Group("/api/v1")

	// Health Check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "active", "module": "backend"})
	})

	// CHAT ENDPOINT (Frontend sends requests here)
	api.Post("/chat", func(c *fiber.Ctx) error {
		// Frontend data structure
		type Request struct {
			Text string `json:"text"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}

		fmt.Printf("🎤 Incoming Voice Text: %s\n", req.Text)

		// 1. AI ile Anla (DeepSeek / OpenAI)
		intent, err := aiService.ParseCommand(req.Text)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "AI Analysis Error: " + err.Error()})
		}

		// 2. (Optional) Simulate / Prepare Transaction
		executionResult := execService.ExecuteIntent(intent)

		// 3. Return Response
		return c.JSON(fiber.Map{
			"status": "success",
			"data":   intent,          // Frontend is expecting this data
			"result": executionResult, // Ekstra loglar
		})
	})

	// 6. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	fmt.Printf("🚀 Sonic Agent Backend Working on Port %s...\n", port)
	log.Fatal(app.Listen(":" + port))
}
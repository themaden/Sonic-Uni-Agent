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
	// 1. .env Dosyasını Yükle
	if err := godotenv.Load(); err != nil {
		fmt.Println("⚠️ .env bulunamadı, sistem değişkenleri kullanılacak.")
	}

	// 2. Fiber Uygulamasını Başlat
	app := fiber.New()

	// 3. Middleware'ler
	app.Use(logger.New()) // Logları görmek için

	// 🚨 KRİTİK AYAR: CORS (Frontend'e İzin Ver)
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", // Sadece bizim Frontend'e izin ver
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// 4. Servisleri Başlat
	aiService := orchestrator.NewAIService()
	execService := orchestrator.NewExecutionService()

	// 5. Rotalar (Routes)
	api := app.Group("/api/v1")

	// Sağlık Kontrolü
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "active", "module": "backend"})
	})

	// CHAT ENDPOINT (Frontend buraya istek atıyor)
	api.Post("/chat", func(c *fiber.Ctx) error {
		// Frontend'den gelen veri yapısı
		type Request struct {
			Text string `json:"text"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Geçersiz istek"})
		}

		fmt.Printf("🎤 Gelen Ses Metni: %s\n", req.Text)

		// 1. AI ile Anla (DeepSeek / OpenAI)
		intent, err := aiService.ParseCommand(req.Text)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "AI Analiz Hatası: " + err.Error()})
		}

		// 2. (Opsiyonel) İşlemi Simüle Et / Hazırla
		executionResult := execService.ExecuteIntent(intent)

		// 3. Cevabı Dön
		return c.JSON(fiber.Map{
			"status": "success",
			"data":   intent,          // Frontend bu veriyi bekliyor
			"result": executionResult, // Ekstra loglar
		})
	})

	// 6. Sunucuyu Başlat
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	fmt.Printf("🚀 Sonic Agent Backend %s Portunda Çalışıyor...\n", port)
	log.Fatal(app.Listen(":" + port))
}
package config

import (
	 "log"
	 "os"

	 "github.com/joho/godotenv"

)
// Config holds all the application configuration settings
type Config struct {
	 
	 Port string
	 Appname string
}


// LoadConfig reads the .env file and populates the Config struct
// SENIOR NOTE: We use a singleton-like pattern here to load config once at startup.

func LoadConfig() *Config {
    
	// Load .env file (ignore error in production if using system env vars)
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  Warning: No .env file found, using system defaults")
	}
	return  &Config{
		Port:    getEnv("PORT", "8080"),
		Appname: getEnv("APP_NAME", "SonicAgent"),
	}

}

// Helper to read env with fallback
func getEnv(key, fallback string) string {

	 if value, exists := os.LookupEnv(key); exists {
		 return value
	 }
	 return fallback
}
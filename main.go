package main

import (
	"log"
	"os"

	"github.com/AbhinitKumarRai/rebalance-funds/src/pkg/router"
	"github.com/AbhinitKumarRai/rebalance-funds/src/pkg/utils"
	"github.com/gin-gonic/gin"
	"github.com/rs/cors"
)

func main() {
	// Initialize environment variables
	if err := utils.SetupEnvironment(); err != nil {
		log.Fatalf("Failed to setup environment: %v", err)
	}

	// Create router
	router := router.SetupRouter()

	// Setup CORS
	router.Use(func(c *gin.Context) {
		cors.New(cors.Options{
			AllowedOrigins:   []string{"*"},
			AllowedMethods:   []string{"POST"},
			AllowedHeaders:   []string{"Content-Type", "Authorization"},
			AllowCredentials: true,
		}).HandlerFunc(c.Writer, c.Request)
	})

	// Basic health check endpoint
	router.GET("/", func(c *gin.Context) {
		c.String(200, "API Working!")
	})

	// API routes
	_ = router.Group("/api") // Using underscore to indicate we're intentionally not using this variable yet
	// TODO: Add your API routes here

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
